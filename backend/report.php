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
	$aScores = array(
		'right' => array(),
		'wrong' => array(),
		'miss' => array()
	);

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

			$aInfoScores = $aRaw->s;
			$aScores['right'][] = $aInfoScores->right;
			$aScores['wrong'][] = $aInfoScores->wrong;
			$aScores['miss'][] = $aInfoScores->miss;
		}
	}

	$aEmotionData = array(
		'labels' => $aTimes,
		'datasets' => array()
	);

	// Create emotion datasets.
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

		$aEmotionData['datasets'][] = $aTemp;
	}

	// Create score datasets
	$aScoreData = array(
		'labels' => $aTimes,
		'datasets' => array()
	);

	// Create emotion datasets.
	foreach($aScores as $aName => $aValues) {
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

		$aScoreData['datasets'][] = $aTemp;
	}

	echo json_encode(array(
		'uuid' => $aUid,
		'date' => date('d/m/Y h:i:s', $aFirstTime / 1000),
		'emotions' => $aEmotionData,
		'scores' => $aScoreData
	));

} catch(Exception $e) {
	echo $e->getMessage();
}

?>
