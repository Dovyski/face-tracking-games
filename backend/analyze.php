<?php

/**
 * Obtains all measurements of a given subjects, crunching all the numbers.
 */

require_once(dirname(__FILE__) . '/config.php');
require_once(dirname(__FILE__) . '/inc/functions.php');

if (php_sapi_name() != 'cli') {
    echo 'This script should be run from the command line.';
    exit();
}

if($argc != 2) {
    echo "Usage: \n";
    echo "  php analyze.php <subjectId>\n";
    exit(1);
}

$aSubjectId = $argv[1];

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aStats = getSubjectData($aDb, $aSubjectId);

print_r($aStats);

?>
