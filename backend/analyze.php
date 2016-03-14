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

if($argc != 2) {
    echo "Usage: \n";
    echo "  php analyze.php <subjectId>\n";
    exit(1);
}

$aSubjectId = $argv[1];
$aGroupingAmount = 15;

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

for($i = 400; $i < 401; $i++) {
    $aData = getSubjectData($aDb, $aSubjectId);
    $aStats = crunchNumbers($aData, $aGroupingAmount);

    echo 'Subject: ' . $i . "\n";
    echo '----------------------------------------' . "\n";

    foreach($aStats['games'] as $aGame) {
        echo 'Period: playing game ' . $aGame['name'] . ' (id='.$aGame['id'].')'."\n";
        echo 'HR mean: ' . $aGame['hr-mean'] ."\n";
        echo 'HR mean (every '.$aGroupingAmount.' seconds):'."\n";
        print_r($aGame['hr-means']);
    }

    $j = 1;
    foreach($aStats['rests'] as $aRest) {
        echo 'Period: resting #' . $j++ ."\n";
        echo 'HR mean: ' . $aRest['hr-mean'] ."\n";
        echo 'HR mean (every '.$aGroupingAmount.' seconds):'."\n";
        print_r($aRest['hr-means']);
    }
}

?>
