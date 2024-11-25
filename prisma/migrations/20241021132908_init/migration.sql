-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isResettingPassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetPasswordToken" TEXT;
