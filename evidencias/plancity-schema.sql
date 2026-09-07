-- PlanCity PostgreSQL schema extracted from InitSchema1787602695769.
-- Replace the bcrypt placeholder before using the administrator seed.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  CREATE TYPE "public"."users_role_enum" AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE "users" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying(100) NOT NULL,
  "email" character varying(150) NOT NULL,
  "password" character varying(255) NOT NULL,
  "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_users_email" UNIQUE ("email"),
  CONSTRAINT "PK_users" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying(100) NOT NULL,
  "description" character varying(255),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
  CONSTRAINT "PK_categories" PRIMARY KEY ("id")
);

CREATE TABLE "events" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying(150) NOT NULL,
  "description" text,
  "date" TIMESTAMP NOT NULL,
  "location" character varying(200) NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "capacity" integer NOT NULL DEFAULT 0,
  "category_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_events_name" UNIQUE ("name"),
  CONSTRAINT "PK_events" PRIMARY KEY ("id")
);

CREATE TABLE "event_images" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "url" character varying(500) NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  "event_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_event_images" PRIMARY KEY ("id")
);

CREATE TABLE "favorites" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "event_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_favorites_user_event" UNIQUE ("user_id", "event_id"),
  CONSTRAINT "PK_favorites" PRIMARY KEY ("id")
);

ALTER TABLE "events"
  ADD CONSTRAINT "FK_events_category"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "event_images"
  ADD CONSTRAINT "FK_event_images_event"
  FOREIGN KEY ("event_id") REFERENCES "events"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "favorites"
  ADD CONSTRAINT "FK_favorites_user"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "favorites"
  ADD CONSTRAINT "FK_favorites_event"
  FOREIGN KEY ("event_id") REFERENCES "events"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

INSERT INTO "users" ("name", "email", "password", "role")
VALUES (
  'Administrador',
  'admin@examen.com',
  '[HASH_BCRYPT_GENERADO_EN_MIGRACION]',
  'admin'
);