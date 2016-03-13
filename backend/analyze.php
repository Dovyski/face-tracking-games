<?php

/**
 * Obtains all measurements of a given subjects, crunching all the numbers.
 */

require_once(dirname(__FILE__) . '/config.php');

if (php_sapi_name() != 'cli') {
    echo 'This script should be run from the command line.';
    exit();
}

if($argc != 2) {
    echo "Usage: \n";
    echo "  php analyze.php <subjectId>\n";
    exit(1);
}

$aSubjectId = $argv[1];
$aExperiment = null;

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aStmt = $aDb->prepare("SELECT * FROM logs WHERE uuid = :uuid ORDER BY timestamp ASC");
$aStmt->bindParam(':uuid', $aSubjectId);
$aStmt->execute();

while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
    $aData = json_decode($aRow['data']);

    if($aData != null) {
        foreach($aData as $aItem) {
            $aEntry = json_decode($aItem->d);

            if(is_string($aEntry)) {
                var_dump($aEntry);
            }
        }

    } else {
        echo "Warning: unable to parse data ".$aRow['data']."\n";
    }
}

echo "All done!\n";

?>
