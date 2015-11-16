<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

require_once(dirname(__FILE__) . '/config.php');

$aUid 	= isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';
$aGame 	= isset($_REQUEST['game']) ? $_REQUEST['game'] : 0;
$aData 	= isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

$aFile	= time() . '-' . $aUid;

if($aUid != '' && $aGame != 0) {
	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$aStmt = $aDb->prepare("INSERT INTO logs (fk_game, timestamp, uuid, data) VALUES (:game, :timestamp, :uuid, :data)");

	$aNow = time();
	$aStmt->bindParam(':game', $aGame);
	$aStmt->bindParam(':timestamp', $aNow);
	$aStmt->bindParam(':uuid', $aUid);
	$aStmt->bindParam(':data', $aData);

	$aStmt->execute();

} else {
	echo 'Empty UID or game id.';
}

?>
