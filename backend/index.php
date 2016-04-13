<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

require_once(dirname(__FILE__) . '/config.php');
require_once(dirname(__FILE__) . '/inc/functions.php');

$aUser 	 = isset($_REQUEST['user']) ? $_REQUEST['user'] : 0;
$aGame 	 = isset($_REQUEST['game']) ? $_REQUEST['game'] : 0;
$aMethod = isset($_REQUEST['method']) ? $_REQUEST['method'] : 'tracking';
$aRet	 = array();

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
	switch($aMethod) {
		case 'tracking':
		case 'answer':
			if($aUser == 0 || $aGame == 0) {
				throw new Exception('Empty UID or game id.');
			}

			$aTable = $aMethod == 'tracking' ? 'logs' : 'questionnaires';
			$aData = isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

			if($aData == '') {
				throw new Exception('No data.');
			}

			$aStmt = $aDb->prepare("INSERT INTO ".$aTable." (fk_game, timestamp, uuid, data) VALUES (:game, :timestamp, :uuid, :data)");

			$aNow = time();
			$aStmt->bindParam(':game', $aGame);
			$aStmt->bindParam(':timestamp', $aNow);
			$aStmt->bindParam(':uuid', $aUser);
			$aStmt->bindParam(':data', $aData);

			$aStmt->execute();
			$aRet['success'] = true;
			break;

		case 'experiments':
			$aStmt = $aDb->prepare("SELECT uuid, timestamp FROM logs WHERE fk_game = -1 AND data LIKE '%experiment_hr_start%'");
			$aStmt->execute();

			$aData = array();

			while($aRow = $aStmt->fetch(PDO::FETCH_OBJ)) {
				$aData[] = $aRow;
			}

			$aRet = array('success' => true, 'data' => $aData);
			break;

		case 'experiment':
			ob_start();
			$aGrouping = isset($_REQUEST['grouping']) ? $_REQUEST['grouping'] : 60;
			$aData = getSubjectData($aDb, $aUser);
			$aStats = crunchNumbers($aData, $aGrouping);
			$aLog = ob_get_contents();
			ob_end_clean();

			$aStats['logs'] = $aLog;
			$aStats['grouping'] = $aGrouping;

			$aRet = array('success' => true, 'data' => $aStats);
			break;

		case 'monitor':
			$aTime = time() - 30;

			$aStmt = $aDb->prepare("SELECT * FROM logs WHERE uuid = :uuid AND timestamp >= :time");
			$aStmt->bindParam(':uuid', $aUser);
			$aStmt->bindParam(':time', $aTime);
			$aStmt->execute();

			$aData = array();

			while($aRow = $aStmt->fetch(PDO::FETCH_OBJ)) {
				$aRow->data = json_decode($aRow->data);
				$aData[] = $aRow;
			}
			$aRet = array('success' => true, 'data' => $aData);
			break;

		case 'active':
			$aTime = time() - 60 * 40;

			$aStmt = $aDb->prepare("SELECT * FROM logs WHERE fk_game = -1 AND timestamp >= :time AND data LIKE '%experiment_hr_start%'");
			$aStmt->bindParam(':time', $aTime);
			$aStmt->execute();

			$aData = array();

			while($aRow = $aStmt->fetch(PDO::FETCH_OBJ)) {
				$aData[] = $aRow;
			}
			$aRet = array('success' => true, 'data' => $aData);
			break;

		default:
			throw new Exception('Unknow method "' .$aMethod. '"');
	}

} catch(Exception $e) {
	$aRet['success'] = false;
	$aRet['message'] = $e->getMessage();
}

header('Content-type: application/json');
echo json_encode($aRet);

?>
