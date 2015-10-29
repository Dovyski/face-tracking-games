<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

define('DB_FILE','database.sqlite');
define('DB_FILE_PATH', dirname(__FILE__) . '/' . DB_FILE);

$aUid 	= isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';
$aData 	= isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

$aFile	= time() . '-' . $aUid;

if($aUid != '') {
	$aCreateTables = !file_exists(DB_FILE);
	$aDb = new PDO('sqlite:' . DB_FILE);

	if($aCreateTables) {
		$aDb->query('CREATE TABLE logs (uuid VARCHAR(36), data TEXT)');
	}

	$aStmt = $aDb->prepare("INSERT INTO logs (uuid, data) VALUES (:uuid, :data)");

	$aStmt->bindParam(':uuid', $aUid);
	$aStmt->bindParam(':data', $aData);
	$aStmt->execute();

} else {
	echo 'Empty UID.';
}

?>
