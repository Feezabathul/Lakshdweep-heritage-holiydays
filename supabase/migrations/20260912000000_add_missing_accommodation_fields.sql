-- Migration to safely add missing accommodation fields
-- Adds heading, accommodation_type, and description_points if they do not already exist.
-- Does not modify or delete existing data.

ALTER TABLE IF EXISTS public.accommodations
  ADD COLUMN IF NOT EXISTS heading TEXT,
  ADD COLUMN IF NOT EXISTS accommodation_type TEXT,
  ADD COLUMN IF NOT EXISTS description_points TEXT[];

-- Backfill heading for existing rows using existing name as fallback.
UPDATE public.accommodations
SET heading = COALESCE(NULLIF(heading, ''), name, 'Untitled')
WHERE heading IS NULL;

-- Backfill accommodation_type using existing category if present.
UPDATE public.accommodations
SET accommodation_type = COALESCE(NULLIF(accommodation_type, ''), NULLIF(category, ''), 'Homestay')
WHERE accommodation_type IS NULL;

-- Backfill description_points from amenities JSONB if description_points is missing.
-- Assumes amenities column exists and is a JSONB array.
UPDATE public.accommodations
SET description_points = ARRAY(SELECT jsonb_array_elements_text(amenities))
WHERE description_points IS NULL
  AND amenities IS NOT NULL
  AND jsonb_typeof(amenities) = 'array'
  AND jsonb_array_length(amenities) > 0;
