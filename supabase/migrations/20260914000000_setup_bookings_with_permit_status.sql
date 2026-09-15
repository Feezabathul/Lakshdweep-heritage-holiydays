-- Create or update the bookings table with canonical columns that match
-- the contact form: customer_name, email, phone, travel_date, travelers,
-- package_name, accommodation_type, message, status, permit_status.
-- Public users (anon) can INSERT. Only admins can SELECT/UPDATE/DELETE.

CREATE TABLE IF NOT EXISTS public.bookings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name       text NOT NULL DEFAULT '',
  email               text NOT NULL DEFAULT '',
  phone               text NOT NULL DEFAULT '',
  travel_date         date,
  travelers           text NOT NULL DEFAULT '',
  package_name        text NOT NULL DEFAULT '',
  accommodation_type  text NOT NULL DEFAULT '',
  message             text NOT NULL DEFAULT '',
  status              text NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  permit_status       text NOT NULL DEFAULT 'Pending'
                        CHECK (permit_status IN ('Pending', 'Approved', 'Cancelled')),
  created_at          timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at          timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Safely add columns that may be missing in older schema versions
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name       text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email               text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS phone               text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS travel_date         date;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS travelers           text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS package_name        text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS accommodation_type  text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS message             text NOT NULL DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS updated_at          timestamptz NOT NULL DEFAULT timezone('utc', now());

-- Add permit_status column with allowed values
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS permit_status text NOT NULL DEFAULT 'Pending';

-- Backfill permit_status for any existing rows
UPDATE public.bookings SET permit_status = 'Pending' WHERE permit_status IS NULL OR permit_status NOT IN ('Pending', 'Approved', 'Cancelled');

-- Add CHECK constraint on permit_status (idempotent via DO block)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name   = 'bookings'
      AND constraint_name = 'bookings_permit_status_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_permit_status_check
      CHECK (permit_status IN ('Pending', 'Approved', 'Cancelled'));
  END IF;
END;
$$;

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) users to INSERT enquiries from the contact form
DROP POLICY IF EXISTS "Anyone can submit a booking enquiry" ON public.bookings;
CREATE POLICY "Anyone can submit a booking enquiry"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Grant anon INSERT so the contact form can save without auth
GRANT INSERT ON TABLE public.bookings TO anon;

-- Allow authenticated admins to manage all bookings
DROP POLICY IF EXISTS "Admins can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

CREATE POLICY "Admins can view bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Grant full access to authenticated (admins are authenticated)
GRANT SELECT, UPDATE, DELETE ON TABLE public.bookings TO authenticated;
