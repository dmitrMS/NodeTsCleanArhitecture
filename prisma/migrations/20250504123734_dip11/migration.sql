/*
  Warnings:

  - Added the required column `author_id` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "executor_id" INTEGER;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "fk_task_author" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "fk_task_executor" FOREIGN KEY ("executor_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
