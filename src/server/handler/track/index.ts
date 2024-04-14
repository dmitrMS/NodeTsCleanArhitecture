import { Jwt } from '../../../jwt';
import { Database } from '../../../database';

export class TrackHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async start(token: string, task_name: string, task_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.beginWorkTime(
          verifyUser ? verifyUser.id : NaN,
          task_name,
          task_id
        )
      : null;
  }

  async stop(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.finishWorkTime(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  async update(
    token: string,
    id_work: number,
    task_name: string,
    begin_time: Date,
    end_time: Date
  ) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.updateWorkTime(
          verifyUser ? verifyUser.id : NaN,
          id_work,
          task_name,
          begin_time,
          end_time
        )
      : null;
  }

  async delete(token: string, id_work: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.deleteWorkTime(id_work) : null;
  }

  async status(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUnfinishedWorkTime(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  async list(token: string, team_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? team_id == null
        ? await this.db.getUsersWorkTimes(verifyUser ? verifyUser.id : NaN)
        : await this.db.getUsersTeamWorkTimes(
            verifyUser ? verifyUser.id : NaN,
            team_id
          )
      : null;
  }

  async listTeam(token: string, team_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getManuUsersTeamWorkTimes(team_id)
      : null;
  }
}
