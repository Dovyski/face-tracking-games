<?php

/**
 * Obtains all measurements of a given subjects, crunching all the numbers.
 */

require_once(dirname(__FILE__) . '/config.php');
require_once(dirname(__FILE__) . '/inc/functions.php');

if (php_sapi_name() != 'cli') {
    echo 'This script should be run from the command line.';
    exit();
}

if($argc != 3) {
    echo "Usage: \n";
    echo "  php analyze.php <firstSubjectId> <lastSubjectId>\n";
    exit(1);
}

$aSubjectIdStart = $argv[1];
$aSubjectIdEnd = $argv[2];
$aGroupingAmount = 15;

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

for($i = $aSubjectIdStart; $i <= $aSubjectIdEnd; $i++) {
    echo 'Subject: ' . $i . "\n";
    echo '*********************************************************************' . "\n";

    echo "Analysis\n";
    echo '----------------------------------------------------' . "\n";

    $aData = getSubjectData($aDb, $i);
    $aStats = crunchNumbers($aData, $aGroupingAmount);

    echo "\nExperiment results\n";
    echo '----------------------------------------------------' . "\n";

    foreach($aStats['games'] as $aGame) {
        echo 'Action: playing ' . $aGame['name'] . ' (id='.$aGame['id'].')'."\n";
        echo 'HR mean: ' . $aGame['hr-mean'] ."\n";
        echo 'HR mean (every '.$aGroupingAmount.' seconds):'."\n";
        print_r($aGame['hr-means']);
        echo 'HR: ' ."\n";
        print_r($aGame['hr']);
    }

    $j = 1;
    foreach($aStats['rests'] as $aRest) {
        echo 'Action: resting #' . $j++ ."\n";
        echo 'HR mean: ' . $aRest['hr-mean'] ."\n";
        echo 'HR mean (every '.$aGroupingAmount.' seconds):'."\n";
        print_r($aRest['hr-means']);
        echo 'HR: ' ."\n";
        print_r($aRest['hr']);
    }

    echo "\n";
}

?>
