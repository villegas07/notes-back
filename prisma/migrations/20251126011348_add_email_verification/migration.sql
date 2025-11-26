-- AddColumn is_email_verified
ALTER TABLE "users" ADD COLUMN "is_email_verified" BOOLEAN NOT NULL DEFAULT false;

-- AddColumn email_verification_token
ALTER TABLE "users" ADD COLUMN "email_verification_token" TEXT;

-- AddColumn email_verification_expires
ALTER TABLE "users" ADD COLUMN "email_verification_expires" TIMESTAMP(3);

-- Create unique constraint on email_verification_token
ALTER TABLE "users" ADD CONSTRAINT "users_email_verification_token_key" UNIQUE ("email_verification_token");
