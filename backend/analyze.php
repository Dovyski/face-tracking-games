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

if($argc < 4) {
    echo "Usage: \n";
    echo " php analyze.php <firstSubjectId> <lastSubjectId> [options]\n\n";
    echo "Options:\n";
    echo " --report      Prints a report of the provided subjects.\n";
    echo " --csv <file>  Outputs all data as a CSV into file <file>.\n";
    exit(1);
}

$aSubjectIdStart = $argv[1];
$aSubjectIdEnd = $argv[2];
$aFormat = $argv[3];

$aIsReport = $aFormat == '--report';
$aIsCSV = $aFormat == '--csv';
$aCSVFile = 'out.csv';

if($aIsCSV) {
    if(!isset($argv[4])) {
        echo 'Option --csv requires a file.' . "\n";
        exit(2);

    } else {
        $aCSVFile = $argv[4];
    }
}

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aGroupingAmount = 15;
$aSubjects = array();

for($i = $aSubjectIdStart; $i <= $aSubjectIdEnd; $i++) {
    echo 'Subject: ' . $i . "\n";
    echo '*********************************************************************' . "\n";

    if($aIsReport) {
        echo "Analysis\n";
        echo '----------------------------------------------------' . "\n";
    }

    $aData = getSubjectData($aDb, $i);
    $aStats = crunchNumbers($aData, $aGroupingAmount);
    $aSubjects[$i] = $aStats;

    if($aIsReport) {
        echo "\nSubject results\n";
        echo '----------------------------------------------------' . "\n";
        echo 'HR baseline: ' . $aStats['baseline'] ."\n";
        $j = 1;
        foreach($aStats['rests'] as $aRest) {
            echo 'HR mean (rest #'.$j++.'): ' . $aRest['hr-mean'] ."\n";
        }

        echo "\nExperiment details\n";
        echo '----------------------------------------------------' . "\n";

        foreach($aStats['games'] as $aGame) {
            echo 'Action: playing ' . $aGame['name'] . ' (id='.$aGame['id'].')'."\n";
            echo 'HR mean: ' . $aGame['hr-mean'] ."\n";
            echo 'HR mean (every '.$aGroupingAmount.' seconds):'."\n";
            printSetAsCSV($aGame['hr-means']);
            echo "\nHR mean baseline (every ".$aGroupingAmount." seconds): \n";
            printSetAsCSV($aGame['hr-means-baseline']);
            echo "\nHR: \n";
            printSetAsCSV($aGame['hr']);
            echo "\n";
        }

        $j = 1;
        foreach($aStats['rests'] as $aRest) {
            echo 'Action: resting #' . $j++ ."\n";
            echo 'HR mean: ' . $aRest['hr-mean'] ."\n";
            echo 'HR mean (every '.$aGroupingAmount.' seconds):'."\n";
            printSetAsCSV($aRest['hr-means']);
            echo "\nHR: \n";
            printSetAsCSV($aRest['hr']);
            echo "\n";
        }

        echo "\n";
    }
}

if($aIsCSV) {
    $aTotal = 0;
    $aFile = fopen($aCSVFile, 'w');

    fwrite($aFile, "time,");

    foreach($aSubjects as $aId => $aInfo) {
        foreach($aInfo['games'] as $aGame) {
            fwrite($aFile, $aId . "-hr-means-" . $aGame['name'] . ",");
            fwrite($aFile, $aId . "-hr-means-baseline-" . $aGame['name'] . ",");
            fwrite($aFile, $aId . "-hr-" . $aGame['name'] . ",");

            // Find out the maximum amount of entries for HR
            if(count($aGame['hr']) > $aTotal) {
                $aTotal = count($aGame['hr']);
            }
        }

        foreach($aInfo['rests'] as $aNum => $aRest) {
            fwrite($aFile, $aId . "-hr-means-rest-" . $aNum . ",");
            fwrite($aFile, $aId . "-hr-rest-" . $aNum . ",");
        }
    }

    fwrite($aFile, "\n");

    for($i = 0; $i < $aTotal; $i++) {
        fwrite($aFile, $i . ",");

        foreach($aSubjects as $aId => $aInfo) {
            foreach($aInfo['games'] as $aGame) {
                fwrite($aFile, ($i < count($aGame['hr-means']) ? sprintf('%.2f', $aGame['hr-means'][$i]) : '') . ",");
                fwrite($aFile, ($i < count($aGame['hr-means-baseline']) ? sprintf('%.2f', $aGame['hr-means-baseline'][$i]) : '') . ",");
                fwrite($aFile, ($i < count($aGame['hr']) ? $aGame['hr'][$i] : '') . ",");
            }

            foreach($aInfo['rests'] as $aNum => $aRest) {
                fwrite($aFile, ($i < count($aRest['hr-means']) ? sprintf('%.2f', $aRest['hr-means'][$i]) : '') . ",");
                fwrite($aFile, ($i < count($aRest['hr']) ? $aRest['hr'][$i] : '') . ",");
            }
        }
        fwrite($aFile, "\n");
    }

    fclose($aFile);

    echo "\nCSV data successfuly saved to file '".$aCSVFile."'\n";
}

?>
