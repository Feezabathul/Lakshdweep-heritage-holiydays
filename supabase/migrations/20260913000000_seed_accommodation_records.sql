-- Seed / update the 3 canonical accommodation records with the correct
-- heading, accommodation_type, description_points, and image_url.
-- Uses name to identify existing rows; inserts if missing.
-- Does NOT delete any data.

-- 1. Homestay
INSERT INTO public.accommodations (name, category, island, heading, accommodation_type, description_points, image_url)
VALUES (
  'Homestay',
  'Homestay',
  'Agatti',
  'Beach Front Homestay',
  'Homestay',
  ARRAY[
    'Beach front location',
    'Local island experience',
    'Comfortable rooms',
    'Authentic hospitality',
    'Budget-friendly option'
  ],
  '/images/homestay.jpg'
)
ON CONFLICT DO NOTHING;

UPDATE public.accommodations
SET
  heading             = 'Beach Front Homestay',
  accommodation_type  = 'Homestay',
  description_points  = ARRAY[
    'Beach front location',
    'Local island experience',
    'Comfortable rooms',
    'Authentic hospitality',
    'Budget-friendly option'
  ],
  image_url           = '/images/homestay.jpg',
  name                = 'Homestay',
  category            = 'Homestay'
WHERE name = 'Homestay';

-- 2. Resort
INSERT INTO public.accommodations (name, category, island, heading, accommodation_type, description_points, image_url)
VALUES (
  'Resort',
  'Resort',
  'Agatti',
  'Beach Resort',
  'Resort',
  ARRAY[
    'Beach resort',
    'Premium accommodation',
    'Beautiful ocean surroundings',
    'Ideal for couples & honeymooners',
    'Enhanced comfort'
  ],
  '/images/resort.jpg'
)
ON CONFLICT DO NOTHING;

UPDATE public.accommodations
SET
  heading             = 'Beach Resort',
  accommodation_type  = 'Resort',
  description_points  = ARRAY[
    'Beach resort',
    'Premium accommodation',
    'Beautiful ocean surroundings',
    'Ideal for couples & honeymooners',
    'Enhanced comfort'
  ],
  image_url           = '/images/resort.jpg',
  name                = 'Resort',
  category            = 'Resort'
WHERE name = 'Resort';

-- 3. Standard Rooms
INSERT INTO public.accommodations (name, category, island, heading, accommodation_type, description_points, image_url)
VALUES (
  'Standard Rooms',
  'Standard Rooms',
  'Agatti',
  'Beach Front Standard Rooms',
  'Standard Rooms',
  ARRAY[
    'Beach front location',
    'Clean & comfortable',
    'Essential amenities',
    'Family-friendly',
    'Affordable'
  ],
  '/images/standard_rooms.jpg'
)
ON CONFLICT DO NOTHING;

UPDATE public.accommodations
SET
  heading             = 'Beach Front Standard Rooms',
  accommodation_type  = 'Standard Rooms',
  description_points  = ARRAY[
    'Beach front location',
    'Clean & comfortable',
    'Essential amenities',
    'Family-friendly',
    'Affordable'
  ],
  image_url           = '/images/standard_rooms.jpg',
  name                = 'Standard Rooms',
  category            = 'Standard Rooms'
WHERE name = 'Standard Rooms';
