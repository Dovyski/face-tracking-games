<?php

/**
 * Initializes the database.
 */

require_once(dirname(__FILE__) . '/config.php');

$aDb = new PDO('sqlite:' . DB_FILE);
$aDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$aDb->query('CREATE TABLE logs (fk_game INTEGER, timestamp INTEGER, uuid VARCHAR(36), data TEXT)');
$aDb->query('CREATE TABLE questionnaires (fk_game INTEGER, timestamp INTEGER, uuid VARCHAR(36), data TEXT)');
$aDb->query('CREATE TABLE games (id PRIMARY KEY, name VARCHAR(100))');
$aDb->query('CREATE INDEX idx_logs_fk_game ON logs (fk_game)');
$aDb->query('CREATE INDEX idx_questionnaire_fk_game ON questionnaires (fk_game)');

// TODO: move this to config
$aDb->query('INSERT INTO games (id, name) VALUES (1, \'Card Flipper\')');
$aDb->query('INSERT INTO games (id, name) VALUES (2, \'Tetris\')');
$aDb->query('INSERT INTO games (id, name) VALUES (3, \'Platformer\')');

echo 'Ok, database initialized';

?>
