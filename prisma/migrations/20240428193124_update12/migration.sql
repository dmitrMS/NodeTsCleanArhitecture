-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "team";

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "team" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
