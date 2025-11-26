-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_expires" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "password_reset_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reset_token" TEXT NOT NULL,
    "reset_token_expires" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "password_reset_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_history_reset_token_key" ON "password_reset_history"("reset_token");

-- CreateIndex
CREATE INDEX "password_reset_history_user_id_idx" ON "password_reset_history"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_history_reset_token_idx" ON "password_reset_history"("reset_token");

-- CreateIndex
CREATE INDEX "notes_is_active_idx" ON "notes"("is_active");

-- AddForeignKey
ALTER TABLE "password_reset_history" ADD CONSTRAINT "password_reset_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
