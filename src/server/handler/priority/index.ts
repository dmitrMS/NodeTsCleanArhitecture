import { Jwt } from '../../../DAL/jwt';
import { Database } from '../../../BLL/database';

// класс, отвечающий за работу с приоритетами
export class PriorityHandler {
  db: Database;
  jwt: Jwt;

  constructor(db: Database, jwt: Jwt) {
    this.db = db;
    this.jwt = jwt;
  }

  // контроллер для вывода списка заданий команды
  async list(token: string) {
    const verifyUser = await this.jwt.auntentification(token);

    return verifyUser !== null ? await this.db.getPriority() : null;
  }
}
