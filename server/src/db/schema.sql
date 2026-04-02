



--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: completed_sets; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.completed_sets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    workout_exercise_id uuid NOT NULL,
    set_number integer NOT NULL,
    reps integer,
    weight numeric,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    duration integer
);



--
-- Name: completed_workouts; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.completed_workouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    workout_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    session_id uuid NOT NULL
);



--
-- Name: exercises; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    CONSTRAINT name_not_empty CHECK ((length(name) > 0))
);



--
-- Name: sets; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.sets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workout_exercise_id uuid NOT NULL,
    set_order integer NOT NULL,
    reps integer,
    weight numeric(6,2),
    duration integer
);



--
-- Name: users; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: workout_exercises; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.workout_exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workout_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    exercise_order integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rest_between_sets integer DEFAULT 60,
    rest_after_exercise integer DEFAULT 180,
    type text DEFAULT 'reps'::text
);


--
-- Name: workout_sessions; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.workout_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    workout_id uuid NOT NULL,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp with time zone,
    status text DEFAULT 'active'::text,
    last_activity timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    progress jsonb
);



--
-- Name: workouts; Type: TABLE; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE TABLE public.workouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: completed_sets completed_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_sets
    ADD CONSTRAINT completed_sets_pkey PRIMARY KEY (id);


--
-- Name: completed_workouts completed_workouts_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_pkey PRIMARY KEY (id);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: sets sets_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_pkey PRIMARY KEY (id);


--
-- Name: sets sets_workout_exercise_id_set_order_key; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_workout_exercise_id_set_order_key UNIQUE (workout_exercise_id, set_order);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: workout_exercises workout_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_pkey PRIMARY KEY (id);


--
-- Name: workout_exercises workout_exercises_workout_id_exercise_order_key; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_workout_id_exercise_order_key UNIQUE (workout_id, exercise_order);


--
-- Name: workout_sessions workout_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_pkey PRIMARY KEY (id);


--
-- Name: workouts workouts_pkey; Type: CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workouts
    ADD CONSTRAINT workouts_pkey PRIMARY KEY (id);


--
-- Name: idx_completed_sets_session_exercise; Type: INDEX; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE INDEX idx_completed_sets_session_exercise ON public.completed_sets USING btree (session_id, workout_exercise_id);


--
-- Name: idx_workouts_user_id; Type: INDEX; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE INDEX idx_workouts_user_id ON public.workouts USING btree (user_id);


--
-- Name: one_active_session_per_user; Type: INDEX; Schema: public; Owner: workout_tracker_rcdn_user
--

CREATE UNIQUE INDEX one_active_session_per_user ON public.workout_sessions USING btree (user_id) WHERE (status = 'active'::text);


--
-- Name: completed_sets completed_sets_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_sets
    ADD CONSTRAINT completed_sets_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: completed_sets completed_sets_workout_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_sets
    ADD CONSTRAINT completed_sets_workout_exercise_id_fkey FOREIGN KEY (workout_exercise_id) REFERENCES public.workout_exercises(id) ON DELETE CASCADE;


--
-- Name: completed_workouts completed_workouts_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.workout_sessions(id) ON DELETE CASCADE;


--
-- Name: completed_workouts completed_workouts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: completed_workouts completed_workouts_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.completed_workouts
    ADD CONSTRAINT completed_workouts_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE;


--
-- Name: sets sets_workout_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_workout_exercise_id_fkey FOREIGN KEY (workout_exercise_id) REFERENCES public.workout_exercises(id) ON DELETE CASCADE;


--
-- Name: workout_exercises workout_exercises_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id);


--
-- Name: workout_exercises workout_exercises_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_exercises
    ADD CONSTRAINT workout_exercises_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE;


--
-- Name: workout_sessions workout_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workout_sessions workout_sessions_workout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workout_sessions
    ADD CONSTRAINT workout_sessions_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE;


--
-- Name: workouts workouts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: workout_tracker_rcdn_user
--

ALTER TABLE ONLY public.workouts
    ADD CONSTRAINT workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

