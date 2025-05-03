-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "project";

-- DropForeignKey
ALTER TABLE "team" DROP CONSTRAINT "project";

-- DropForeignKey
ALTER TABLE "work_time" DROP CONSTRAINT "task";

-- AddForeignKey
ALTER TABLE "work_time" ADD CONSTRAINT "task" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
