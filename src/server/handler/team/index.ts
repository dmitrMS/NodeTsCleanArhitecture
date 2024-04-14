import { Jwt } from '../../../jwt';
import { Database } from '../../../database';

export class TeamHandler {
  db: Database;
  jwt: Jwt;

    constructor(db: Database, jwt: Jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    async create(token: string,name: string) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
      const team=await this.db.createTeam(verifyUser ? verifyUser.id : NaN,name)
  
      return team.id !== null
        ? await this.db.createUserTeam(verifyUser? verifyUser.id : NaN,team.id)
        : null;
    }
  
    async delete(token: string, team_id: number) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
  
      return verifyUser !== null
        ? await this.db.deleteTeam(team_id)
        : null;
    }
  
    async addUserTeam(token: string,login: string,team_id: number) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);
      const invitedUser=await this.db.findUserByLogin(login);
  
      return invitedUser !== null
        ? await this.db.createNotification(verifyUser ? verifyUser.id : NaN,invitedUser.id,team_id)
        : null;
    }
  
    async list(token: string) {
      const verifyUser = await this.jwt.auntentification(token);
  
      return verifyUser !== null
        ? await this.db.getUsersTeams(verifyUser ? verifyUser.id : NaN)
        : null;
    }
  }