<?php

/**
 * This script will parse an CSV file generated bt the TomTom watch and insert ibase_trans
 * values in the database as HR entries.
 */

require_once(dirname(__FILE__) . '/config.php');

if (php_sapi_name() != 'cli') {
    echo 'This script should be run from the command line.';
    exit();
}

if($argc < 3) {
    echo "Usage: \n";
    echo "  php hr2db.php <subjectId> /path/to/hr.csv \n";
    exit(1);
}

$aSubjectId = $argv[1];
$aHRFile = $argv[2];

if(!file_exists($aHRFile)) {
    echo "Unable to open HR CSV file: " . $aHRFile;
    exit(2);
}

$aExperiment = null;
$aData = array();
$aFile = fopen($aHRFile, 'r');

while (($aLine = fgetcsv($aFile)) !== FALSE) {
    $aData[] = array('time' => $aLine[0], 'hr' => $aLine[9]);
}
fclose($aFile);

// Remove CSV file header
unset($aData[0]);

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aStmt = $aDb->prepare("SELECT * FROM logs WHERE uuid = :uuid AND data LIKE '%experiment_hr_start%'");
$aStmt->bindParam(':uuid', $aSubjectId);
$aStmt->execute();

while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
    $aExperiment[] = $aRow;
}

if($aExperiment == null) {
    echo "Experiment for uuid ".$aSubjectId." has no experiment_hr_start\n";
    exit(4);
}

if(count($aExperiment) > 1) {
    echo "Experiment for uuid ".$aSubjectId." has multiple experiment_hr_start\n";
    exit(3);
}

$aTimestampStart = $aExperiment[0]['timestamp'] + 0;

foreach($aData as $aRow) {
    $aHR            = $aRow['hr'] == '' ? 0 : $aRow['hr'];
    $aRelativeTime  = $aRow['time'] + 0;
    $aTime          = $aTimestampStart + $aRelativeTime;
    $aJsonData      = '[{"t":' . $aTime .'000,"d":"{\"hr\":' . $aHR . '}"}]';

    $aDb->query("INSERT INTO logs (fk_game, timestamp, uuid, data) VALUES (-1, ".$aTime.", '".$aSubjectId."', '".$aJsonData."')");
}

echo "All done!\n";

?>
