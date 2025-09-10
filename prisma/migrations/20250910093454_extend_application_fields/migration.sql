/*
  Warnings:

  - You are about to drop the column `income` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "income",
ADD COLUMN     "abn" TEXT,
ADD COLUMN     "annualIncome" DOUBLE PRECISION,
ADD COLUMN     "assets" JSONB,
ADD COLUMN     "currentAddress" TEXT,
ADD COLUMN     "dependents" INTEGER,
ADD COLUMN     "deposit" DOUBLE PRECISION,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "employerName" TEXT,
ADD COLUMN     "employmentStartDate" TIMESTAMP(3),
ADD COLUMN     "employmentStatus" TEXT,
ADD COLUMN     "expenses" JSONB,
ADD COLUMN     "features" JSONB,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "incomeType" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "loanPurpose" TEXT,
ADD COLUMN     "lvr" DOUBLE PRECISION,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "occupancy" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other';
