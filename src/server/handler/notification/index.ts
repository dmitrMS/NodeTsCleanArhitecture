import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database'; 

// класс, отвечающий за уведомления
export class NotificationHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt : Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер для обновления статуса уведомления
  async updateTeam(token : string, notification_id : number, team_id : number) {
    const verifyUser = await this.jwt.auntentification(token);

    await this.db.updateStatusNotification(notification_id);

    return verifyUser !== null
      ? await this.db.createUserTeam(verifyUser ? verifyUser.id : NaN,team_id)
      : null;
  }
 
  // контроллер для удаления уведомления
  async delete(token : string, id : number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.deleteNotification(id) : null;
  }

  // контроллер для вывода уведомлений, на которые нет ответа
  async status(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUncoordinatedNotifications(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  // вывод всех уведомлений
  async list(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getAllNotifications(verifyUser ? verifyUser.id : NaN)
      : null;
  }
}
