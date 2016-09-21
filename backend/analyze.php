<?php

/**
 * Analyse data generating measurements for a given set of subjects. Numbers are
 * processed in different ways, e.g. mean, etc.
 */

require_once(dirname(__FILE__) . '/config.php');
require_once(dirname(__FILE__) . '/inc/functions.php');

if (php_sapi_name() != 'cli') {
    echo 'This script should be run from the command line.';
    exit();
}

if($argc < 2) {
    echo "Usage: \n";
    echo " php analyze.php [<subjectId>|<firstId>:<lastId>] [options]\n\n";
    echo "Options:\n";
    echo " --report         Prints the processing as a report.\n";
    echo " --csv <file>     Saves the processing as a CSV file defined by <file>.\n";
    echo " --export <file>  Exports all HR entries as a file define by <file>.\n";
    exit(1);
}

$aSubjectIdStart = 0;
$aSubjectIdEnd = 0;

if(strpos($argv[1], ':') !== false) {
    $aValues = explode(':', $argv[1]);

    if(count($aValues) != 2) {
        echo 'Invalid subject range "'.$argv[1].'". It should be "start:end", e.g. 400:418.' . "\n";
        exit(2);
    }

    $aSubjectIdStart = $aValues[0];
    $aSubjectIdEnd = $aValues[1];

} else {
    $aSubjectIdStart = $argv[1];
    $aSubjectIdEnd = $argv[1];
}

// If nothing is specified, assume this is a report
$aFormat = isset($argv[2]) ? $argv[2] : '--report';

$aIsReport = $aFormat == '--report';
$aIsCSV = $aFormat == '--csv';
$aIsExport = $aFormat == '--export';
$aOutputFile = $aIsCSV ? 'out.csv' : 'out.txt';

if($aIsCSV || $aIsExport) {
    if(!isset($argv[3])) {
        echo 'You need to speficy a file.' . "\n";
        exit(2);

    } else {
        $aOutputFile = $argv[3];
    }
}

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aGroupingAmount = 60; // size of the group when calculating grouped mean for HR entries.
$aSubjects = array();
$aGames = findGames($aDb);

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

        echo "\nQuestionnaire details\n";
        echo '----------------------------------------------------' . "\n";
        foreach($aStats['questionnaires'] as $aGameQuestionnaire) {
            echo $aGameQuestionnaire['game'] . ": \n";

            foreach($aGameQuestionnaire['data'] as $aEntry) {
                echo $aEntry->q . ', ' . $aEntry->a . ', ' . $aEntry->al . "\n";
            }
            echo "\n";
        }
    }

    if($aIsExport) {
        $aHRStarted = getWhenHRTrackingStarted($aDb, $i);
        $aFile = fopen($aOutputFile, 'w');

        foreach($aStats['raw'] as $aLine) {
            fwrite($aFile, $i . ' ');
            fwrite($aFile, $aLine['timestamp'] . ' ');
            fwrite($aFile, ($aLine['timestamp'] - $aHRStarted) . ' ');
            fwrite($aFile, $aLine['hr'] . ' ');
            fwrite($aFile, getGameLabelByTimestamp($aData, $aLine['timestamp']) . "\n");
        }

        fclose($aFile);

        echo "\n" . 'Summary' . "\n";
        echo '-------------------------------' . "\n";

        echo 'HR measurements' . "\n";
        echo '  Start: 0 (timestamp: ' . $aHRStarted . ')' . "\n";
        echo '  End: '.($aLine['timestamp'] - $aHRStarted).' (timestamp: ' . $aLine['timestamp'] . ')' . "\n";

        foreach($aData['games'] as $aNum => $aGame) {
            echo 'Game #' . ($aNum + 1) . ' - ' . $aGame['name'] . "\n";
            echo '  Start: ' . ($aGame['start'] - $aHRStarted) . ' (timestamp: ' . $aGame['start'] . ')' . "\n";
            echo '  End: ' . ($aGame['end'] - $aHRStarted) . ' (timestamp: ' . $aGame['end'] . ')' . "\n";
        }

        // Export a bat file that guides the execution of this ground file
        $aOutputBatFile = $aOutputFile . '.bat';
        writeBatFileBasedOnGroundData($aOutputBatFile, $aData, $i, $aHRStarted);

        echo "\nData successfuly exported to files \"".$aOutputFile."\" and \"".$aOutputBatFile."\".\n";
    }
    echo "\n";
}

if($aIsReport) {
    echo "Questionnaire stats for subjects (N=".count($aSubjects).")\n";
    echo "*********************************************************************\n";

    $aGame = array();
    $aGameId = -1;
    foreach($aSubjects as $aId => $aInfo) {
        foreach($aInfo['questionnaires'] as $aGameQuestionnaire) {
            $aGameId = $aGameQuestionnaire['id'];

            if(!isset($aGame[$aGameId])) {
                $aGame[$aGameId] = array();
            }

            foreach($aGameQuestionnaire['data'] as $aEntry) {
                if(!isset($aGame[$aGameId][$aEntry->q])) {
                    $aGame[$aGameId][$aEntry->q] = array();
                }
                $aGame[$aGameId][$aEntry->q][] = (int)$aEntry->a;
            }
        }
    }

    foreach($aGame as $aId => $aQuestions) {
        echo (isset($aGames[$aId]) ? "Game ".$aGames[$aId]." (id=" . $aId . ")" : "Demographics") . "\n";

        foreach($aQuestions as $aQuestion => $aAnswers) {
            echo $aQuestion . "\n";
            echo " Answers (MEAN = ".sprintf('%.2f', (double) array_sum($aAnswers) / count($aAnswers))."):\n";
            echo "  " . implode("\n  ", $aAnswers);
            echo "\n";
        }
        echo "\n";
    }
}

if($aIsCSV) {
    $aTotal = 0;
    $aFile = fopen($aOutputFile, 'w');

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

    echo "\nCSV data successfuly saved to file \"".$aOutputFile."\".\n";
}

?>
