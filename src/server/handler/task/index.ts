import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

// класс, отвечающий за работу с заданиями
export class TaskHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер создания задания
  async create(token: string, name: string, team_id: number) {
    const verifyUser = await this.jwt.auntentificationAdmin(token);

    return verifyUser !== null ? await this.db.createTask(name, team_id) : null;
  }

  // контроллер для удаления задания
  async delete(token: string, id_task: number) {
    const verifyUser = await this.jwt.auntentificationAdmin(token);

    return verifyUser !== null ? await this.db.deleteTask(id_task) : null;
  }

  // контроллер для вывода списка заданий команды
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
