-- If an old database already exist, migrate from it
ALTER TABLE IF EXISTS archivecode
    RENAME TO archive_code;

ALTER TABLE IF EXISTS configtype
    RENAME TO config_type;

ALTER TABLE config DROP CONSTRAINT fk_config__config_type;

CREATE TYPE CONFIG_TYPE_E AS ENUM ('string', 'long_string', 'number');

ALTER TABLE config
ALTER COLUMN config_type TYPE CONFIG_TYPE_E USING config_type::CONFIG_TYPE_E;

DROP TABLE config_type;

ALTER TYPE CONFIG_TYPE_E
RENAME TO CONFIG_TYPE;

ALTER TABLE IF EXISTS groupyear
    RENAME TO group_year;

ALTER TABLE IF EXISTS groupmeeting
    RENAME TO group_meeting;

ALTER TABLE IF EXISTS group_meeting
    RENAME COLUMN group_group TO group_name;

ALTER TABLE IF EXISTS groupmeetingfile
    RENAME TO group_meeting_file;

ALTER TABLE IF EXISTS group_meeting_file
    RENAME COLUMN group_task_group_group_group TO group_name;

ALTER TABLE IF EXISTS group_meeting_file
    RENAME COLUMN group_task_group_group_year TO group_year;

ALTER TABLE IF EXISTS group_meeting_file
    RENAME COLUMN group_task_group_meeting TO meeting;

ALTER TABLE IF EXISTS group_meeting_file
    RENAME COLUMN group_task_task TO task;

ALTER TABLE IF EXISTS groupmeetingtask
    RENAME TO group_meeting_task;

ALTER TABLE IF EXISTS group_meeting_task
    RENAME COLUMN group_group_group TO group_name;

ALTER TABLE IF EXISTS group_meeting_task
    RENAME COLUMN group_group_year TO group_year;

ALTER TABLE IF EXISTS group_meeting_task
    RENAME COLUMN group_meeting TO meeting;

ALTER TABLE task
ADD COLUMN for_finished_group BOOLEAN DEFAULT FALSE;

UPDATE task
SET for_finished_group = TRUE
WHERE name = 'vberattelse'
    OR name = 'eberattelse';

ALTER TABLE task
ALTER COLUMN for_finished_group
SET NOT NULL;