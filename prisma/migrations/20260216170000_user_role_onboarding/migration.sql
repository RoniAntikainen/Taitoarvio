-- prisma/migrations/20260216170000_user_role_onboarding/migration.sql

ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
ALTER TABLE "User" ADD COLUMN "onboardingCompletedAt" DATETIME;
