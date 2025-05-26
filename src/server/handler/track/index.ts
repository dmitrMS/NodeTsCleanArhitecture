import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

// класс для работы с рабочим временем
export class TrackHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер для начала работы пользователя
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

  // контроллер для окончания работы пользователя
  async stop(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.finishWorkTime(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  //контроллер для обновления данных о работе
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

  // контроллер для удаления работы
  async delete(token: string, id_work: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.deleteWorkTime(id_work) : null;
  }

  // контроллер для проверки неоконченной работы
  async status(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUnfinishedWorkTime(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  async listNoTeam(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getUsersWorkTimes(verifyUser ? verifyUser.id : NaN)
      : null;
  }

  // контроллер для вывода списка  всех работ по заданию
  async listTask(token: string, task_id: number) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null
      ? await this.db.getManuUsersTaskWorkTimes(task_id)
      : null;
  }
}
