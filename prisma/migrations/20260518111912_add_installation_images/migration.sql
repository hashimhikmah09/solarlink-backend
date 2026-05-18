-- AlterTable
ALTER TABLE "Installation" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
