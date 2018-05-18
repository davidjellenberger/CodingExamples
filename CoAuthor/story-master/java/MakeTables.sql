SET search_path TO story;

CREATE TABLE users (
-- an alternative to serial is integer ... default nextval('u_id_seq')
  u_id serial primary key,
  name char(64) NOT NULL UNIQUE,
  date_joined timestamptz DEFAULT current_timestamp,
  picture_path char(64),
  bio text
);

CREATE TABLE stories (
  s_id serial primary key,
  creator integer references users(u_id),
  title char(128) NOT NULL,
  max_length integer NOT NULL,
  genre char(128),
  created timestamptz DEFAULT current_timestamp,
  current_turn int references users(u_id),
  turn_start timestamptz DEFAULT current_timestamp,
  turn_length interval DEFAULT '12 hours',
  -- internal variable so that next user is chosen independently for each row
  turn_next_seed double precision DEFAULT random(),
  picture_path char(64),
  description text,
  content text
);

CREATE TABLE chapters (
  c_id serial primary key,
  story integer references stories(s_id),
  author integer references users(u_id),
  parent integer references chapters(c_id),
  created timestamptz DEFAULT current_timestamp,
  content text
);

CREATE TABLE locks (
  u_id integer unique references users(u_id),
  s_id integer unique references stories(s_id),
  created timestamptz DEFAULT current_timestamp
);

CREATE TABLE subscriptions (
  u_id integer NOT NULL references users(u_id),
  s_id integer references stories(s_id),
  UNIQUE(u_id, s_id)
);

GRANT INSERT, SELECT, UPDATE, DELETE ON users, stories, chapters, locks, subscriptions TO mca_s16_story;
GRANT USAGE, SELECT, UPDATE ON users_u_id_seq, stories_s_id_seq, chapters_c_id_seq TO mca_s16_story;
