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

function getSubjectRawData($thePDO, $theSubjectId) {
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

function getSubjectData($thePDO, $theSubjectId) {
    $aGames = findGames($thePDO);
    $aRawData = getSubjectRawData($thePDO, $theSubjectId);

    $aStats = array('games' => array(), 'rests' => array());
    $aTimeStarted = 0;
    $aInRest = false;
    $aInGame = false;
    $aHREntries = array();

    foreach($aRawData as $aRow) {
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
                                $aTimeStarted = (int)($aItem->t / 1000.0);
                            }
                            break;

                        case 'game_end':
                            $aStats['games'][] = array(
                                'id' => $aRow['fk_game'],
                                'name'=> $aGames[$aRow['fk_game']],
                                'hr' => $aHREntries,
                                'start' => $aTimeStarted,
                                'end' => (int)($aItem->t / 1000.0)
                            );
                            $aInGame = false;
                            break;

                        case 'experiment_rest_start':
                            $aInRest = true;
                            $aHREntries = array();
                            $aTimeStarted = $aRow['timestamp'];
                            break;

                        case 'experiment_game_start':
                            if($aInRest) {
                                $aStats['rests'][] = array(
                                    'hr' => $aHREntries,
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
                    }
                }
            }

        } else {
            echo "Warning: unable to parse data ".$aRow['data']."\n";
        }
    }

    return $aStats;
}

?>
