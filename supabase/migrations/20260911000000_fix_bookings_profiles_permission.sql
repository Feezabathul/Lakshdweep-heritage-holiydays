-- Keep booking management restricted to authenticated admin users.
-- Use the protected admin role check so profiles remain private.
drop policy if exists "Admins can view bookings" on public.bookings;
drop policy if exists "Admins can update bookings" on public.bookings;
drop policy if exists "Admins can delete bookings" on public.bookings;

drop policy if exists "Admins can insert bookings" on public.bookings;

create policy "Admins can view bookings"
  on public.bookings for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update bookings"
  on public.bookings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete bookings"
  on public.bookings for delete
  to authenticated
  using (public.is_admin());
