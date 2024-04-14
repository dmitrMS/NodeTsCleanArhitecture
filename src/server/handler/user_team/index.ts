import { Jwt } from '../../../jwt';
import { Database } from '../../../database';

export class UserTeamHandler {
  db: Database;
  jwt: Jwt;
  
    constructor(db: Database, jwt: Jwt) {
      this.db = db;
      this.jwt = jwt;
    }
  
    // async delete(token: string,user_id : number, team_id : number) {
    //   const verifyUser = await this.jwt.auntentification(token);
  
    //   return verifyUser !== null
    //     ? await this.db.deleteUserTeam(user_id, team_id)
    //     : null;
    // }
  
    async list(token: string,team_id : number) {
      const verifyUser = await this.jwt.auntentificationAdmin(token);

      const userTeam=await this.db.getUsersTeam(team_id);

      const users = [];

      for (const element of userTeam) {
        const user=await this.db.findUserById(element.user_id);
        const numWorks=await this.db.getUsersWorkTimes(user ? user.id : NaN);
        const numTeamWorks = numWorks ? numWorks.filter(function(work) {
          return work.task_id !== undefined;
        }) : undefined;
        const item = {
          login: user? user.login : undefined,
          role: user ? user.role : undefined,
          numTeamWorks: numTeamWorks ? numTeamWorks.length : NaN,
        };
        users.push(item);
      }
  
      return verifyUser !== null ? users : null;
    }
  }