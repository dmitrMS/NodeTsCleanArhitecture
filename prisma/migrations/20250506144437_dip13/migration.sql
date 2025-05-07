-- AlterTable
ALTER TABLE "task" ADD COLUMN     "priority_id" INTEGER;

-- CreateTable
CREATE TABLE "priority" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependency" (
    "id" SERIAL NOT NULL,
    "main_task_id" INTEGER NOT NULL,
    "dependency_task_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dependency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "priority" FOREIGN KEY ("priority_id") REFERENCES "priority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dependency" ADD CONSTRAINT "fk_main_task" FOREIGN KEY ("main_task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dependency" ADD CONSTRAINT "fk_dependency_task" FOREIGN KEY ("dependency_task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
