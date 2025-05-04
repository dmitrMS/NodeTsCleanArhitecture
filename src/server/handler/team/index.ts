import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

//класс для работы с командами
export class TeamHandler {
  db: Database;
  jwt: Jwt;

    constructor(db: Database, jwt: Jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  

    // контроллер для создания команды
    async create(token: string, project_id: number) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
      const team=await this.db.createTeam(verifyUser ? verifyUser.id : NaN, project_id)
  
      return team.id !== null
        ? await this.db.createUserTeam(verifyUser? verifyUser.id : NaN,team.id)
        : null;
    }
  
    // контроллер для удаления команды
    async delete(token: string, team_id: number) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
  
      return verifyUser !== null
        ? await this.db.deleteTeam(team_id)
        : null;
    }
  
    // контроллер для добавления учатсника в команду
    async addUserTeam(token: string,login: string,team_id: number) {
      const verifyUser = await this.jwt.auntentification(token);
      const invitedUser=await this.db.findUserByLogin(login);
  
      return invitedUser !== null
        ? await this.db.createNotification(verifyUser ? verifyUser.id : NaN,invitedUser.id,team_id)
        : null;
    }
  
    // контроллер для вывода списка команд
    async list(token: string) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.getUsersTeams(verifyUser ? verifyUser.id : NaN)
        : null;
    }

    // контроллер вывода инофрмации о команде 
    async info(token: string,team_id: number) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.getTeamById(team_id)
        : null;
    }
  }