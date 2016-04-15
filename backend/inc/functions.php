<?php

// Get info about all games (name, id, etc)
function findGames($thePDO) {
    $aGames = array();
    $aResult = $thePDO->query("SELECT id,name FROM games WHERE 1");

    foreach ($aResult as $aGameInfo) {
        $aGames[$aGameInfo['id']] = $aGameInfo['name'];
    }

    return $aGames;
}

function getSubjectRawQuestionnaireData($thePDO, $theSubjectId) {
    $aData = array();

    // Get all data generated by the informed subject
    $aStmt = $thePDO->prepare("SELECT * FROM questionnaires WHERE uuid = :uuid ORDER BY timestamp ASC");
    $aStmt->bindParam(':uuid', $theSubjectId);
    $aStmt->execute();

    while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
        $aData[] = $aRow;
    }

    return $aData;
}

function getSubjectRawGameData($thePDO, $theSubjectId) {
    $aData = array();

    // Get all data generated by the informed subject
    $aStmt = $thePDO->prepare("SELECT * FROM logs WHERE uuid = :uuid ORDER BY timestamp ASC");
    $aStmt->bindParam(':uuid', $theSubjectId);
    $aStmt->execute();

    while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
        $aData[] = $aRow;
    }

    return $aData;
}

function collectGameStats($theSubjectRawGameData, $theGames) {
    $aStats = array('games' => array(), 'rests' => array());

    $aTimeStarted = 0;
    $aInRest = false;
    $aInGame = false;
    $aHREntries = array();
    $aActionEntries = array();

    foreach($theSubjectRawGameData as $aRow) {
        $aData = json_decode($aRow['data']);

        if($aData != null) {
            foreach($aData as $aItem) {
                $aEntry = json_decode($aItem->d);

                if(is_string($aEntry)) {
                    // This is a milestone mark (start of the game, end of rest, etc.)
                    switch($aEntry) {
                        case 'game_start':
                        case 'tutorial_start':
                            if(!$aInGame) {
                                $aInGame = true;
                                $aHREntries = array();
                                $aActionEntries = array();
                                $aTimeStarted = (int)($aItem->t / 1000.0);
                            }
                            break;

                        case 'game_end':
                            $aStats['games'][] = array(
                                'id' => $aRow['fk_game'],
                                'name'=> $theGames[$aRow['fk_game']],
                                'hr' => sanitizeHRValues($aHREntries, $theGames[$aRow['fk_game']]),
                                'actions' => $aActionEntries,
                                'start' => $aTimeStarted,
                                'end' => (int)($aItem->t / 1000.0)
                            );
                            $aInGame = false;
                            break;

                        case 'experiment_rest_start':
                            $aInRest = true;
                            $aHREntries = array();
                            $aActionEntries = array();
                            $aTimeStarted = $aRow['timestamp'];
                            break;

                        case 'experiment_game_start':
                            if($aInRest) {
                                $aStats['rests'][] = array(
                                    'hr' => sanitizeHRValues($aHREntries, 'Rest of a Subject'),
                                    'start' => $aTimeStarted,
                                    'end' => $aRow['timestamp']
                                );
                                $aInRest = false;
                            }
                            break;
                    }
                } else {
                    // This is data collected from a game or the HR watch.
                    // Let's handle it

                    if(property_exists($aEntry, 'hr')) {
                        // It's a HR entry
                        $aHREntries[] = $aEntry->hr;

                    } else {
                        // It's a game entry (action, hit, etc)
                        if(property_exists($aEntry, 'a')) {
                            if(strpos($aEntry->a, 'mouse') === false &&
                               strpos($aEntry->a, 'key')   === false &&
                               strpos($aEntry->a, 'jump')  === false &&
                               strpos($aEntry->a, 'dash')  === false) {

                                $aActionEntries[] = array(
                                    'action' => $aEntry->a,
                                    'value' => getInGameActionValueFromLabel($aEntry->a),
                                    'timestamp' => $aItem->t
                                );
                            }
                        }
                    }
                }
            }

        } else {
            if($aRow['data'] != '[]') {
                echo "  Warning: unable to parse data ".$aRow['data']."\n";
            }
        }
    }

    return $aStats;
}

function getInGameActionValueFromLabel($theLabel) {
    $aValues = array(
        'newBlock' => 25,
        'scored' => 50,
        'collectable' => 50,
        'overcome' => 50,
        'hurt' => 0,
        'difficulty' => 25,
        'question' => 25,
        'right' => 50,
        'wrong' => 0,
        'miss' => 25
    );

    return $aValues[$theLabel];
}

function collectQuestionaireStats($theSubjectRawQuestionnaireData, $theGames) {
    $aStats = array();
    $aGameId = -1;
    $i = 0;

    foreach($theSubjectRawQuestionnaireData as $aRow) {
        $aData = json_decode($aRow['data']);
        $aGameId = $i == count($theGames) ? -1 : $aRow['fk_game'];

        if($aData != null) {
            if(is_array($aData->d)) {
                $aGameStats = array(
                    'id' => $aGameId,
                    'game' => isset($theGames[$aGameId]) ? $theGames[$aGameId] : '(Demographic)',
                    'data' => array()
                );

                foreach($aData->d as $aEntry) {
                    $aGameStats['data'][] = $aEntry;
                }

                $aStats[] = $aGameStats;
            } else {
                echo "  Warning: questionnaire entry with timestamp=".$aRow['timestamp']." seems strange. Take a look at it.\n";
            }
        } else {
            echo "  Warning: unable to parse questionnaire data ".$aRow['data']."\n";
        }

        $i++;
    }

    return $aStats;
}

function getSubjectData($thePDO, $theSubjectId) {
    $aGames = findGames($thePDO);
    $aRawGameData = getSubjectRawGameData($thePDO, $theSubjectId);
    $aRawQuestionnaireData = getSubjectRawQuestionnaireData($thePDO, $theSubjectId);

    $aStats = collectGameStats($aRawGameData, $aGames);
    $aStats['questionnaires'] = collectQuestionaireStats($aRawQuestionnaireData, $aGames);

    return $aStats;
}

// Checks for wrong values, such as zero, one-value spikes, etc.
function sanitizeHRValues($theValues, $theWhere = '') {
    $aRet = array();

    foreach($theValues as $aHR) {
        if($aHR <= 0 || $aHR == '') {
            echo '  Warning: suspicious HR value ' . $aHR . " removed from set " . $theWhere . ".\n";
        } else {
            $aRet[] = $aHR;
        }
    }

    return $aRet;
}

function calculateMeans($theValues, $theGroupingAmount = 15) {
    $aRet = array();
    $aSumAllValues = 0;

    $aCount = 0;
    $aSum = 0;
    $aHRMeans = array();

    foreach($theValues as $aHR) {
        $aSumAllValues += $aHR;
        $aSum += $aHR;
        $aCount++;

        if($aCount == $theGroupingAmount) {
            $aMean = (double) $aSum / $aCount;
            $aCount = 0;
            $aSum = 0;

            $aHRMeans[] = $aMean;
        }
    }

    $aRet['means'] = $aHRMeans;
    $aRet['mean'] = (double) $aSumAllValues / count($theValues);

    return $aRet;
}

// Calculates all sorts of means from the provided subject data,
function crunchNumbers($theSubjectData, $theGroupingAmount = 15) {
    foreach($theSubjectData['games'] as $aKey => $aGame) {
        echo 'Analyzing game ' . $aGame['name'] . "\n";
        $aMeans = calculateMeans(sanitizeHRValues($aGame['hr']), $theGroupingAmount);

        $theSubjectData['games'][$aKey]['hr-means'] = $aMeans['means'];
        $theSubjectData['games'][$aKey]['hr-mean'] = $aMeans['mean'];
    }

    foreach($theSubjectData['rests'] as $aKey => $aRest) {
        echo 'Analyzing rest #' . $aKey . "\n";
        $aMeans = calculateMeans(sanitizeHRValues($aRest['hr']), $theGroupingAmount);

        $theSubjectData['rests'][$aKey]['hr-means'] = $aMeans['means'];
        $theSubjectData['rests'][$aKey]['hr-mean'] = $aMeans['mean'];
    }

    $theSubjectData['baseline'] = calculateBaseline($theSubjectData);
    $theSubjectData = calculateVariationsFromBaseline($theSubjectData, $theSubjectData['baseline']);

    return $theSubjectData;
}

function calculateVariationsFromBaseline($theSubjectData, $theBaseline) {
    foreach($theSubjectData['games'] as $aKey => $aGame) {
        $aValues = array();

        foreach($aGame['hr-means'] as $aEntry) {
            $aValues[] = $aEntry - $theBaseline;
        }

        $theSubjectData['games'][$aKey]['hr-means-baseline'] = $aValues;
    }

    return $theSubjectData;
}

// Baseline is the average heart rate during the rest periods.
function calculateBaseline($theSubjectData) {
    $aSum = $theSubjectData['rests'][0]['hr-mean'] + $theSubjectData['rests'][1]['hr-mean'];
    $aRet = $aSum / 2.0;

    return $aRet;
}

function printSetAsCSV($theValus) {
    foreach($theValus as $aKey => $aValue) {
        echo $aKey . "," . sprintf('%.2f', $aValue) . "\n";
    }
}

?>
