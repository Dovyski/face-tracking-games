<?php

/**
 * Receives data from post/get requests and stores it
 * in a database
 */

$aUid 	= isset($_REQUEST['uid']) ? $_REQUEST['uid'] : '';
$aData 	= isset($_REQUEST['data']) ? $_REQUEST['data'] : '';

$aFile	= time() . '-' . $aUid;

if($aUid != '') {
	file_put_contents($aFile, $aUid . "\n" . $aData);
} else {
	echo 'Empty UID.';
}

?>
