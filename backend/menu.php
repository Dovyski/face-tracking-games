<?php

/**
 * Generates the content of the dashboard menu.
 */

require_once(dirname(__FILE__) . '/config.php');

$aUid = isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';

try {
	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$aStmt = $aDb->prepare("SELECT DISTINCT uuid FROM logs WHERE 1"); // TODO: use create a game column
	$aStmt->execute();

	$aSubjects = array();

	while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
		$aSubjects[] = $aRow['uuid'];
	}

	$aData = array(
		'Card Flipper' => $aSubjects
	);

	echo json_encode($aData);

} catch(Exception $e) {
	echo $e->getMessage();
}

?>
