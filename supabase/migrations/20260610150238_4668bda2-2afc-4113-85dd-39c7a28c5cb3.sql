
-- ============================================================
-- KTTC FULL BACKEND MIGRATION
-- ============================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- ============================================================
-- CORE: profiles, user_roles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  country_origin TEXT,
  main_goal TEXT,
  relocation_stage TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  target_country_id UUID,
  target_city_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- GEOGRAPHY
-- ============================================================
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  currency_code TEXT NOT NULL DEFAULT 'EUR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.countries TO anon, authenticated;
GRANT ALL ON public.countries TO service_role;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_id, slug)
);
GRANT SELECT ON public.cities TO anon, authenticated;
GRANT ALL ON public.cities TO service_role;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_target_country_id_fkey FOREIGN KEY (target_country_id) REFERENCES public.countries(id) ON DELETE SET NULL,
  ADD CONSTRAINT profiles_target_city_id_fkey FOREIGN KEY (target_city_id) REFERENCES public.cities(id) ON DELETE SET NULL;

-- ============================================================
-- NEIGHBORHOODS
-- ============================================================
CREATE TABLE public.neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Portugal',
  region TEXT NOT NULL,
  vibe TEXT,
  distance_to_center TEXT,
  price_per_m2 NUMERIC,
  yield NUMERIC,
  investment_score NUMERIC,
  lifestyle_score NUMERIC,
  safety_score NUMERIC,
  transport_score NUMERIC,
  risk_level TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.neighborhoods TO authenticated;
GRANT SELECT ON public.neighborhoods TO anon;
GRANT ALL ON public.neighborhoods TO service_role;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER neighborhoods_updated_at BEFORE UPDATE ON public.neighborhoods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.neighborhood_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id UUID NOT NULL UNIQUE REFERENCES public.neighborhoods(id) ON DELETE CASCADE,
  story_intro TEXT, ai_story TEXT, kttc_insight TEXT,
  pros JSONB, cons JSONB, ideal_for JSONB, not_ideal_for JSONB,
  avg_price NUMERIC, city_avg_price NUMERIC, price_growth NUMERIC, price_level TEXT,
  expat_popularity TEXT, tourist_density TEXT, coworking_density TEXT,
  green_areas TEXT, transport_quality TEXT,
  metro_access BOOLEAN, beach_access BOOLEAN, bike_lanes BOOLEAN,
  bus_stations JSONB, metro_lines JSONB, train_stations JSONB,
  coworking_spaces JSONB, hospitals JSONB, markets JSONB, parks JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.neighborhood_details TO authenticated;
GRANT SELECT ON public.neighborhood_details TO anon;
GRANT ALL ON public.neighborhood_details TO service_role;
ALTER TABLE public.neighborhood_details ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER neighborhood_details_updated_at BEFORE UPDATE ON public.neighborhood_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.neighborhood_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_per_m2 NUMERIC, rental_yield NUMERIC,
  lifestyle_score NUMERIC, safety_score NUMERIC, transport_score NUMERIC,
  investment_rating TEXT, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.neighborhood_stats TO authenticated;
GRANT SELECT ON public.neighborhood_stats TO anon;
GRANT ALL ON public.neighborhood_stats TO service_role;
ALTER TABLE public.neighborhood_stats ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER neighborhood_stats_updated_at BEFORE UPDATE ON public.neighborhood_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.user_shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES public.neighborhoods(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, neighborhood_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_shortlists TO authenticated;
GRANT ALL ON public.user_shortlists TO service_role;
ALTER TABLE public.user_shortlists ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CONTENT
-- ============================================================
CREATE TABLE public.city_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, subtitle TEXT, description TEXT,
  thumbnail_url TEXT, pdf_url TEXT, pdf_path TEXT,
  content_markdown TEXT, sections JSONB,
  country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  premium_only BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.city_papers TO authenticated;
GRANT SELECT ON public.city_papers TO anon;
GRANT ALL ON public.city_papers TO service_role;
ALTER TABLE public.city_papers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, category TEXT NOT NULL,
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  description TEXT, website TEXT, logo_url TEXT, contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT SELECT ON public.resources TO anon;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT, type TEXT NOT NULL,
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 0,
  date_start TIMESTAMPTZ, date_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiences TO authenticated;
GRANT SELECT ON public.experiences TO anon;
GRANT ALL ON public.experiences TO service_role;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER experiences_updated_at BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  thumbnail TEXT, video_url TEXT,
  country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webinars TO authenticated;
GRANT SELECT ON public.webinars TO anon;
GRANT ALL ON public.webinars TO service_role;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  booking_status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.deal_calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  renovation_cost NUMERIC NOT NULL DEFAULT 0,
  monthly_rent NUMERIC NOT NULL DEFAULT 0,
  yield NUMERIC, roi NUMERIC, cash_flow NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deal_calculators TO authenticated;
GRANT ALL ON public.deal_calculators TO service_role;
ALTER TABLE public.deal_calculators ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER deal_calculators_updated_at BEFORE UPDATE ON public.deal_calculators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- LEARNING
-- ============================================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  price NUMERIC NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT SELECT ON public.courses TO anon;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT SELECT ON public.modules TO anon;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT, content TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  thumbnail_url TEXT, thumbnail_storage_path TEXT,
  video_url TEXT, video_storage_path TEXT, video_mime_type TEXT,
  video_size_bytes BIGINT, video_duration_seconds INTEGER, video_uploaded_at TIMESTAMPTZ,
  auto_complete_on_watch BOOLEAN NOT NULL DEFAULT true,
  prerequisite_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT SELECT ON public.lessons TO anon;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.lesson_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_storage_path TEXT NOT NULL,
  file_size_bytes BIGINT, mime_type TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_attachments TO authenticated;
GRANT ALL ON public.lesson_attachments TO service_role;
ALTER TABLE public.lesson_attachments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage NUMERIC NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT, INSERT, DELETE ON public.course_favorites TO authenticated;
GRANT ALL ON public.course_favorites TO service_role;
ALTER TABLE public.course_favorites ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.course_purchases TO authenticated;
GRANT ALL ON public.course_purchases TO service_role;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.course_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT,
  unlock_type TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_resources TO authenticated;
GRANT ALL ON public.course_resources TO service_role;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  watched_percentage NUMERIC NOT NULL DEFAULT 0,
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.lesson_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, DELETE ON public.lesson_bookmarks TO authenticated;
GRANT ALL ON public.lesson_bookmarks TO service_role;
ALTER TABLE public.lesson_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_lesson_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_lesson_activity TO authenticated;
GRANT ALL ON public.user_lesson_activity TO service_role;
ALTER TABLE public.user_lesson_activity ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.video_watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  total_watch_seconds INTEGER NOT NULL DEFAULT 0,
  watched_percentage NUMERIC NOT NULL DEFAULT 0,
  watch_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_watch_history TO authenticated;
GRANT ALL ON public.video_watch_history TO service_role;
ALTER TABLE public.video_watch_history ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER video_watch_history_updated_at BEFORE UPDATE ON public.video_watch_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  target_country TEXT, target_stage TEXT, target_goal TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_paths TO authenticated;
GRANT SELECT ON public.learning_paths TO anon;
GRANT ALL ON public.learning_paths TO service_role;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.path_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  UNIQUE (path_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.path_courses TO authenticated;
GRANT SELECT ON public.path_courses TO anon;
GRANT ALL ON public.path_courses TO service_role;
ALTER TABLE public.path_courses ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- QUIZZES
-- ============================================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'single_choice',
  order_index INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_answers TO authenticated;
GRANT ALL ON public.quiz_answers TO service_role;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score NUMERIC NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.user_quiz_attempts TO authenticated;
GRANT ALL ON public.user_quiz_attempts TO service_role;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.user_quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_answer_id UUID REFERENCES public.quiz_answers(id) ON DELETE SET NULL
);
GRANT SELECT, INSERT ON public.user_quiz_answers TO authenticated;
GRANT ALL ON public.user_quiz_answers TO service_role;
ALTER TABLE public.user_quiz_answers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- COMMUNITY
-- ============================================================
CREATE TABLE public.posts_kttc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  country_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts_kttc TO authenticated;
GRANT ALL ON public.posts_kttc TO service_role;
ALTER TABLE public.posts_kttc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts_kttc REPLICA IDENTITY FULL;
CREATE TRIGGER posts_kttc_updated_at BEFORE UPDATE ON public.posts_kttc
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.comments_kttc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts_kttc(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments_kttc TO authenticated;
GRANT ALL ON public.comments_kttc TO service_role;
ALTER TABLE public.comments_kttc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments_kttc REPLICA IDENTITY FULL;
CREATE TRIGGER comments_kttc_updated_at BEFORE UPDATE ON public.comments_kttc
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.likes_kttc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts_kttc(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.likes_kttc TO authenticated;
GRANT ALL ON public.likes_kttc TO service_role;
ALTER TABLE public.likes_kttc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes_kttc REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.posts_kttc, public.comments_kttc, public.likes_kttc;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- VIEWS
-- ============================================================
CREATE OR REPLACE VIEW public.public_user_profiles AS
  SELECT id, full_name, avatar_url FROM public.profiles;
GRANT SELECT ON public.public_user_profiles TO anon, authenticated;

CREATE OR REPLACE VIEW public.partners_public AS
  SELECT id, name, category, country_id, city_id, description, website, logo_url, created_at FROM public.partners;
GRANT SELECT ON public.partners_public TO anon, authenticated;

CREATE OR REPLACE VIEW public.quiz_answers_public AS
  SELECT id, question_id, answer_text FROM public.quiz_answers;
GRANT SELECT ON public.quiz_answers_public TO anon, authenticated;

-- ============================================================
-- RLS POLICIES
-- ============================================================
CREATE POLICY "Profiles self read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles admin delete" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Roles self read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Roles admin manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Countries public read" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Countries admin write" ON public.countries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cities public read" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Cities admin write" ON public.cities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Neighborhoods read" ON public.neighborhoods FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Neighborhoods admin write" ON public.neighborhoods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Neighborhood details read" ON public.neighborhood_details FOR SELECT USING (true);
CREATE POLICY "Neighborhood details admin write" ON public.neighborhood_details FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Neighborhood stats read" ON public.neighborhood_stats FOR SELECT USING (true);
CREATE POLICY "Neighborhood stats admin write" ON public.neighborhood_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Shortlists self all" ON public.user_shortlists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "City papers read" ON public.city_papers FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "City papers admin write" ON public.city_papers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners auth read" ON public.partners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Partners admin write" ON public.partners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Resources read" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Resources admin write" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Experiences read" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Experiences admin write" ON public.experiences FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Webinars read" ON public.webinars FOR SELECT USING (true);
CREATE POLICY "Webinars admin write" ON public.webinars FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Consultations self all" ON public.consultations FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Bookings self all" ON public.bookings FOR ALL TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deal calculators self all" ON public.deal_calculators FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Courses read" ON public.courses FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Courses admin write" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Modules read" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND (c.is_published OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Modules admin write" ON public.modules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lessons read" ON public.lessons FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lessons admin write" ON public.lessons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lesson attachments read" ON public.lesson_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Lesson attachments admin write" ON public.lesson_attachments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Enrollments self all" ON public.course_enrollments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Favorites self all" ON public.course_favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Purchases self read" ON public.course_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Purchases self insert" ON public.course_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Course resources read" ON public.course_resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Course resources admin write" ON public.course_resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lesson progress self all" ON public.lesson_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lesson bookmarks self all" ON public.lesson_bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lesson activity self all" ON public.user_lesson_activity FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Video history self all" ON public.video_watch_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learning paths read" ON public.learning_paths FOR SELECT USING (is_published OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Learning paths admin write" ON public.learning_paths FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Path courses read" ON public.path_courses FOR SELECT USING (true);
CREATE POLICY "Path courses admin write" ON public.path_courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Quizzes read" ON public.quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Quizzes admin write" ON public.quizzes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Quiz questions read" ON public.quiz_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Quiz questions admin write" ON public.quiz_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Quiz answers admin read" ON public.quiz_answers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Quiz answers admin write" ON public.quiz_answers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Attempts self read" ON public.user_quiz_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Attempts self insert" ON public.user_quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User answers self read" ON public.user_quiz_answers FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_quiz_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid())
);
CREATE POLICY "User answers self insert" ON public.user_quiz_answers FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_quiz_attempts a WHERE a.id = attempt_id AND a.user_id = auth.uid())
);

CREATE POLICY "Posts kttc read" ON public.posts_kttc FOR SELECT TO authenticated USING (true);
CREATE POLICY "Posts kttc self insert" ON public.posts_kttc FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Posts kttc self update" ON public.posts_kttc FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Posts kttc self delete" ON public.posts_kttc FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Comments kttc read" ON public.comments_kttc FOR SELECT TO authenticated USING (true);
CREATE POLICY "Comments kttc self insert" ON public.comments_kttc FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comments kttc self update" ON public.comments_kttc FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Comments kttc self delete" ON public.comments_kttc FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Likes kttc read" ON public.likes_kttc FOR SELECT TO authenticated USING (true);
CREATE POLICY "Likes kttc self insert" ON public.likes_kttc FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Likes kttc self delete" ON public.likes_kttc FOR DELETE TO authenticated USING (auth.uid() = user_id);
