<?php

/**
 * Generates the content of the dashboard menu.
 */

require_once(dirname(__FILE__) . '/config.php');

$aUid = isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';

try {
	$aDb = new PDO('sqlite:' . DB_FILE);
	$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$aData = array();
	$aResult = $aDb->query("SELECT id,name FROM games WHERE 1");

	foreach ($aResult as $aGameRow) {
		$aStmt = $aDb->prepare("SELECT DISTINCT uuid FROM logs WHERE fk_game = :game");
		$aStmt->bindParam(':game', $aGameRow['id']);
		$aStmt->execute();

		$aSubjects = array();

		while($aRow = $aStmt->fetch(PDO::FETCH_ASSOC)) {
			$aSubjects[] = $aRow['uuid'];
		}

		$aData[] = array(
			'name' 		=> $aGameRow['name'],
			'id' 		=> $aGameRow['id'],
			'subjects'	=> $aSubjects
		);
	}

	echo json_encode($aData);

} catch(Exception $e) {
	echo $e->getMessage();
}

?>
