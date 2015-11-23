<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

require_once(dirname(__FILE__) . '/config.php');

function randColor() {
	static $aIndex = 0;

	$aRandColors = array(
		'255,0,0',
		'0,255,0',
		'0,0,255',
		'255,0,255',
		'0,255,255'
	);

	$aRet = $aRandColors[$aIndex];

	if(++$aIndex >= count($aRandColors)) {
		$aIndex = 0;
	}

	return $aRet;
}

function generateChartConfig($theArray) {
	$aColor = randColor();

	$theArray['fillColor'] = 'rgba('.$aColor.', 0.05)';
	$theArray['strokeColor'] = 'rgba('.$aColor.', 1)';
	$theArray['pointColor'] = 'rgba('.$aColor.', 1)';
	$theArray['pointStrokeColor'] = '#fff';
	$theArray['pointHighlightFill'] = '#fff';
	$theArray['pointHighlightStroke'] = 'rgba('.$aColor.', 1)';

	return $theArray;
}

function generateDataset($theName, $theValue) {
	$aTemp = array();
	$aTemp['label'] = $theName;
	$aTemp['data'] = $theValue;
	$aTemp = generateChartConfig($aTemp);

	return $aTemp;
}


$aUid = isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';
$aGame = isset($_REQUEST['game']) ? $_REQUEST['game'] : '';

try {

	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$aStmt = $aDb->prepare("SELECT * FROM logs WHERE uuid = :uuid AND fk_game = :game");

	$aStmt->bindParam(':uuid', $aUid);
	$aStmt->bindParam(':game', $aGame);
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

			// Process the message according to the fields it has
			// TODO: get data based on game type

			// Message about the current score
			if(property_exists($aRaw, 's')) {
				$aInfoScores = $aRaw->s;
				$aScores['right'][] = @$aInfoScores->right;
				$aScores['wrong'][] = @$aInfoScores->wrong;
				$aScores['miss'][] = @$aInfoScores->miss;
			}

			// Message about emotions
			if(property_exists($aRaw, 'e')) {
				$aInfoEmotions = $aRaw->e;

				foreach($aInfoEmotions as $aEmotionEntry) {
					if(!isset($aEmotions[$aEmotionEntry->emotion])) {
						$aEmotions[$aEmotionEntry->emotion] = array();
					}

					$aEmotions[$aEmotionEntry->emotion][] = $aEmotionEntry->value;
				}
			}

			// Message about a new turn
			if(property_exists($aRaw, 'turn')) {
				$aInfoTurn = $aRaw->turn;
			}
		}
	}

	// Create emotion datasets.
	$aEmotionData = array(
		'labels' => $aTimes,
		'datasets' => array()
	);
	foreach($aEmotions as $aName => $aValues) {
		$aEmotionData['datasets'][] = generateDataset($aName, $aValues);
	}

	// Create score datasets
	$aScoreData = array(
		'labels' => $aTimes,
		'datasets' => array()
	);
	foreach($aScores as $aName => $aValues) {
		$aScoreData['datasets'][] = generateDataset($aName, $aValues);
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
