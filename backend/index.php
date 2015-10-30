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
	$aCreateTables = !file_exists(DB_FILE);
	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if($aCreateTables) {
		$aDb->query('CREATE TABLE logs (fk_game INTEGER, timestamp INTEGER, uuid VARCHAR(36), data TEXT)');
		$aDb->query('CREATE TABLE games (id PRIMARY KEY, name VARCHAR(100))');
		$aDb->query('CREATE INDEX idx_fk_game ON logs (fk_game)');
	}

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
