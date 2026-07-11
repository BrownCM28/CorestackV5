-- Enums
CREATE TYPE job_category AS ENUM (
  'operations', 'construction', 'electrical_power', 'cooling_mechanical', 'networking'
);
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE profile_role AS ENUM ('seeker', 'employer');

-- profiles (links to auth.users)
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name  text,
  role          profile_role NOT NULL DEFAULT 'seeker',
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- jobs
CREATE TABLE jobs (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title              text NOT NULL,
  company            text NOT NULL,
  location           text NOT NULL,
  category           job_category NOT NULL,
  remote             boolean NOT NULL DEFAULT false,
  description        text NOT NULL,
  salary_min         integer,
  salary_max         integer,
  apply_target       text NOT NULL,
  posted_by          uuid REFERENCES profiles ON DELETE SET NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  status             job_status NOT NULL DEFAULT 'active',
  paid_amount_cents  integer NOT NULL DEFAULT 0
);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Authenticated users can insert jobs"
  ON jobs FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE USING (auth.uid() = posted_by);
CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE USING (auth.uid() = posted_by);

-- applications
CREATE TABLE applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  applicant_id  uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, applicant_id)
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT USING (auth.uid() = applicant_id);

-- saved_jobs
CREATE TABLE saved_jobs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES jobs ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved jobs"
  ON saved_jobs USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- news
CREATE TABLE news (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline      text NOT NULL,
  source        text NOT NULL,
  url           text NOT NULL,
  excerpt       text,
  published_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);

-- resources
CREATE TABLE resources (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  type         text NOT NULL CHECK (type IN ('cert', 'school', 'program')),
  provider     text NOT NULL,
  url          text NOT NULL,
  description  text
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);

-- Trigger: auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name, role)
  VALUES (new.id, new.email, 'seeker');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
