/*
  Warnings:

  - The primary key for the `orderdetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `orderdetail_id` to the `orderdetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderdetail` DROP PRIMARY KEY,
    ADD COLUMN `orderdetail_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`orderdetail_id`);

-- CreateIndex
CREATE INDEX `order_id` ON `orderdetail`(`order_id`);
