import { Jwt } from '../../../jwt';
import { Database } from '../../../database';

export class TaskHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async create(token: string, name: string, team_id: number) {
    const verifyUser = await this.jwt.auntentificationAdmin(token);

    return verifyUser !== null ? await this.db.createTask(name, team_id) : null;
  }

  async delete(token: string, id_task: number) {
    const verifyUser = await this.jwt.auntentificationAdmin(token);

    return verifyUser !== null ? await this.db.deleteTask(id_task) : null;
  }

  // async status(token: string) {
  //   const verifyUser = await this.jwt.auntentificationAdmin(token);

  //   return verifyUser !== null
  //     ? await this.db.getUnfinishedTasks()
  //     : null;
  // }

  async list(token: string, team_id: number) {
    const verifyUser = await this.jwt.auntentification(token);
    
    interface Team {
      id: number;
      name: string;
      admin_id: number;
      created_at: Date;
      updated_at: Date;
    }

    const usersTeam = await this.db.getTeamById(team_id) as Team;

    return verifyUser !== null ? await this.db.getTeamTasks(usersTeam) : null;
  }
}
