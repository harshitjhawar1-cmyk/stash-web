-- ============================================================================
-- 001_initial_schema.sql
-- Initial database schema for StashWeb (save now, read later)
-- ============================================================================

-- ============================================================================
-- 1. ARTICLES
-- ============================================================================

create table articles (
  id                       uuid        primary key default gen_random_uuid(),
  user_id                  uuid        not null references auth.users(id) on delete cascade,
  url                      text        not null,
  canonical_url            text,
  title                    text,
  domain                   text,
  snippet                  text,
  image_url                text,
  html_content             text,
  text_content             text,
  estimated_read_time_minutes int,
  is_read                  boolean     not null default false,
  metadata_status          text        not null default 'pending'
                           check (metadata_status in ('pending', 'fetching', 'fetched', 'failed')),
  metadata_retry_count     int         not null default 0,
  saved_at                 timestamptz not null default now(),
  read_at                  timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  -- Full-text search vector generated from title, domain, and snippet
  fts                      tsvector    generated always as (
                             to_tsvector('english',
                               coalesce(title, '') || ' ' ||
                               coalesce(domain, '') || ' ' ||
                               coalesce(snippet, '')
                             )
                           ) stored
);

create index idx_articles_fts on articles using gin (fts);
create index idx_articles_user_canonical on articles (user_id, canonical_url);

alter table articles enable row level security;

create policy "Users can select their own articles"
  on articles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own articles"
  on articles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own articles"
  on articles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own articles"
  on articles for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 2. FOLDERS
-- ============================================================================

create table folders (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  name              text        not null,
  icon              text        not null default 'folder',
  color_hex         text        not null default '#007AFF',
  is_system         boolean     not null default false,
  system_identifier text        check (system_identifier in ('unsorted', 'to_read')),
  sort_order        int         not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Only one folder per user for each system identifier
alter table folders
  add constraint uq_folders_user_system_identifier
  unique (user_id, system_identifier)
  -- Postgres partial unique indexes must be created as an index, not a constraint
  ;

-- Replace the table-level unique constraint with a partial unique index so
-- that rows where system_identifier IS NULL are excluded from the check.
alter table folders drop constraint uq_folders_user_system_identifier;

create unique index uq_folders_user_system_identifier
  on folders (user_id, system_identifier)
  where system_identifier is not null;

alter table folders enable row level security;

create policy "Users can select their own folders"
  on folders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own folders"
  on folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own folders"
  on folders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on folders for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 3. ARTICLE_FOLDERS (join table)
-- ============================================================================

create table article_folders (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  article_id  uuid        not null references articles(id) on delete cascade,
  folder_id   uuid        not null references folders(id) on delete cascade,
  created_at  timestamptz not null default now(),

  constraint uq_article_folders_article_folder unique (article_id, folder_id)
);

alter table article_folders enable row level security;

create policy "Users can select their own article_folders"
  on article_folders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own article_folders"
  on article_folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own article_folders"
  on article_folders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own article_folders"
  on article_folders for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 4. HIGHLIGHTS
-- ============================================================================

create table highlights (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  article_id    uuid        not null references articles(id) on delete cascade,
  selected_text text        not null,
  note          text,
  color_name    text        not null default 'yellow'
                check (color_name in ('yellow', 'blue', 'green', 'pink')),
  start_offset  int,
  end_offset    int,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Full-text search vector generated from selected_text and note
  fts           tsvector    generated always as (
                  to_tsvector('english',
                    coalesce(selected_text, '') || ' ' ||
                    coalesce(note, '')
                  )
                ) stored
);

create index idx_highlights_fts on highlights using gin (fts);

alter table highlights enable row level security;

create policy "Users can select their own highlights"
  on highlights for select
  using (auth.uid() = user_id);

create policy "Users can insert their own highlights"
  on highlights for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own highlights"
  on highlights for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own highlights"
  on highlights for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 5. READING_PROGRESS
-- ============================================================================

create table reading_progress (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  article_id        uuid        not null references articles(id) on delete cascade,
  scroll_percentage real        not null default 0,
  scroll_y_offset   real        not null default 0,
  last_read_at      timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint uq_reading_progress_user_article unique (user_id, article_id)
);

alter table reading_progress enable row level security;

create policy "Users can select their own reading_progress"
  on reading_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reading_progress"
  on reading_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reading_progress"
  on reading_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own reading_progress"
  on reading_progress for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 6. USER_PREFERENCES
-- ============================================================================

create table user_preferences (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null unique references auth.users(id) on delete cascade,
  reader_font_size    int         not null default 18,
  reader_font_family  text        not null default 'serif',
  reader_theme        text        not null default 'light'
                      check (reader_theme in ('light', 'dark', 'sepia')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table user_preferences enable row level security;

create policy "Users can select their own user_preferences"
  on user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own user_preferences"
  on user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own user_preferences"
  on user_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own user_preferences"
  on user_preferences for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 7. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to every table that carries an updated_at column

create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

create trigger trg_folders_updated_at
  before update on folders
  for each row execute function set_updated_at();

create trigger trg_highlights_updated_at
  before update on highlights
  for each row execute function set_updated_at();

create trigger trg_reading_progress_updated_at
  before update on reading_progress
  for each row execute function set_updated_at();

create trigger trg_user_preferences_updated_at
  before update on user_preferences
  for each row execute function set_updated_at();
