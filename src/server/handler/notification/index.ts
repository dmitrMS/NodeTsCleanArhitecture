import { Jwt } from '../../../jwt';
import { Database } from '../../../database'; 

export class NotificationHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt : Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  async updateTeam(token : string, notification_id : number, team_id : number) {
    const verifyUser = await this.jwt.auntentification(token);

    await this.db.updateStatusNotification(notification_id);

    return verifyUser !== null
      ? await this.db.createUserTeam(verifyUser ? verifyUser.id : NaN,team_id)
      : null;
  }

  async delete(token : string, id : number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.deleteNotification(id) : null;
  }

  async status(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUncoordinatedNotifications(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  async list(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getAllNotifications(verifyUser ? verifyUser.id : NaN)
      : null;
  }
}
