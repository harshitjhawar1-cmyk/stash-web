-- ============================================================================
-- 002_seed_system_folders.sql
-- Automatically create system folders for every newly registered user
-- ============================================================================

create or replace function seed_system_folders()
returns trigger as $$
begin
  insert into public.folders (user_id, name, icon, color_hex, is_system, system_identifier, sort_order)
  values
    (new.id, 'Unsorted',  'tray',     '#8E8E93', true, 'unsorted', 0),
    (new.id, 'To Read',   'bookmark', '#FF9500', true, 'to_read',  1);
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_seed_system_folders
  after insert on auth.users
  for each row execute function seed_system_folders();
