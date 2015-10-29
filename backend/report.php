<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

require_once(dirname(__FILE__) . '/config.php');

$aUid = isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';

try {

	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$aStmt = $aDb->prepare("SELECT * FROM logs WHERE uuid = :uuid");

	$aStmt->bindParam(':uuid', $aUid);
	$aStmt->execute();

	$aFirstTime = -1;
	$aTimes = array();
	$aEmotions = array();
	$aScores = array();

	while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
		$aTemp = json_decode($aRow['data']);

		foreach($aTemp as $aValue) {
			$aInfoTimestamp	= $aValue->t;

			if($aFirstTime == -1) {
				$aFirstTime = $aInfoTimestamp;
			}

			$aTimes[] = sprintf('%.1f', ($aInfoTimestamp - $aFirstTime) / 1000);

			$aRaw = json_decode($aValue->d);
			$aInfoEmotions = $aRaw->e;

			foreach($aInfoEmotions as $aEmotionEntry) {
				if(!isset($aEmotions[$aEmotionEntry->emotion])) {
					$aEmotions[$aEmotionEntry->emotion] = array();
				}

				$aEmotions[$aEmotionEntry->emotion][] = $aEmotionEntry->value;
			}

			$aScores[] = $aRaw->s;
		}
	}

	$aData = array(
		'labels' => $aTimes,
		'datasets' => array()
	);

	foreach($aEmotions as $aName => $aValues) {
		$aTemp = array();

		$aTemp['label'] = $aName;
		$aTemp['data'] = $aValues;

		$aColor = rand(50, 255).','.rand(50, 255).','.rand(50, 255);

		$aTemp['fillColor'] = 'rgba('.$aColor.', 0.2)';
		$aTemp['strokeColor'] = 'rgba('.$aColor.', 1)';
		$aTemp['pointColor'] = 'rgba('.$aColor.', 1)';
		$aTemp['pointStrokeColor'] = '#fff';
		$aTemp['pointHighlightFill'] = '#fff';
		$aTemp['pointHighlightStroke'] = 'rgba('.$aColor.', 1)';

		$aData['datasets'][] = $aTemp;
	}

	echo json_encode(array(
		'uuid' => $aUid,
		'date' => date('d/m/Y h:i:s', $aFirstTime),
		'data' => $aData
	));

} catch(Exception $e) {
	echo $e->getMessage();
}

?>
