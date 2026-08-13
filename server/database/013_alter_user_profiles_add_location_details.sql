-- Additive only. preferred_location TEXT keeps working exactly
-- as before for anything that already reads it.
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS preferred_location_details JSONB;