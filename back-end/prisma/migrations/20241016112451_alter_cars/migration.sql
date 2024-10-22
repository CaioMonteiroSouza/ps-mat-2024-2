/*
  Warnings:

  - You are about to drop the column `modified_user_id` on the `Car` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_modified_user_id_fkey";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "modified_user_id",
ADD COLUMN     "created_user_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
