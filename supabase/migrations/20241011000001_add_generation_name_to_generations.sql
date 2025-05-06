/*
 migration: add_generation_name_to_generations
 description: adds a generation_name column to the generations table
 notes: sets a default value of 'DEFAULT' for existing and new records
 timestamp: 2024-10-11 00:00:01 (utc)
*/

-- Add generation_name column to generations table
ALTER TABLE generations
    ADD COLUMN generation_name varchar(100) NOT NULL DEFAULT 'DEFAULT'; 