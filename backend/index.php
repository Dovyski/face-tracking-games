<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

require_once(dirname(__FILE__) . '/config.php');

$aUid 	= isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';
$aData 	= isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

$aFile	= time() . '-' . $aUid;

if($aUid != '') {
	$aCreateTables = !file_exists(DB_FILE);
	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
