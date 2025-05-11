import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

// класс для работы с участниками команды
export class UserTeamHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер для удаления участника из команды
  async delete(token: string, user_team_id: number) {
    const verifyUser = await this.jwt.auntentificationProjectHead(token,user_team_id);

    return verifyUser !== null
      ? await this.db.deleteUserTeam(user_team_id)
      : null;
  }

  // контроллер для удаления участника из команды
  async update(token: string, user_team_id: number, role_id: number) {
    const verifyUser = await this.jwt.auntentificationProjectHead(token,user_team_id);

    return verifyUser !== null
      ? await this.db.updateUsersTeam(user_team_id, role_id)
      : null;
  }

  // контроллер для вывода списка участников команды
  async list(token: string, project_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    const team = await this.db.getProjectTeam(project_id);

    const userTeam = await this.db.getUsersTeam(team ? team.id : NaN);

    const users = [];

    for (const element of userTeam) {
      const user = await this.db.findUserById(element.user_id);
      const numWorks = await this.db.getUsersWorkTimes(user ? user.id : NaN);
      // console.log(numWorks);
      const numTeamWorks = numWorks
        ? numWorks.filter(function (work) {
            return work.task_id !== null;
          })
        : undefined;
      // console.log(numTeamWorks);
      const item = {
        id: user ? user.id : undefined,
        user_team_id: element ? element.id : undefined,
        login: user ? user.login : undefined,
        role_id: element ? element.role_id : undefined,
        numTeamWorks: numTeamWorks ? numTeamWorks.length : NaN
      };
      users.push(item);
    }
    console.log(userTeam);
    console.log(users);

    return verifyUser !== null ? users : null;
  }

  // контроллер для получения роли в проекте
  async role(token: string, project_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    const team = await this.db.getProjectTeam(project_id);

    return verifyUser !== null
      ? await this.db.usersTeamRole(verifyUser ? verifyUser.id : NaN, team ? team.id : NaN)
      : null;
  }
}
