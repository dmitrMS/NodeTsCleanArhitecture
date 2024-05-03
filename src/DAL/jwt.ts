import jwt,{ JwtPayload } from 'jsonwebtoken';
import { cfg } from './config.js';
import { Database } from '../BLL/database.js';

// секрет
const authHeader = 'x-auth-key';

// класс для создания и взаимодействия с jwt токенами
export class Jwt {
  db: Database;
  constructor(db:Database) {
    this.db = db;
  }

  // функция создания токена
  createToken(id:number, role:string) {
    const token = jwt.sign(
      {
        id: id,
        role: role
      },
      cfg.jwt.secret,
      { expiresIn: cfg.jwt.endTime }
    );

    return token;
  }

  /// функция проверки jwt токена
  async auntentification(token:string) {
    try {
      const decoded = jwt.verify(token, cfg.jwt.secret, {
        ignoreExpiration: false
      });

      if (decoded) {
        const id = jwt.decode(token, { complete: true }) as JwtPayload;

        interface UserPayload {
          id: number
        }

        const verifyUser = await this.db.findUserById(id ? id.payload.id : NaN) as UserPayload;
        const verifyRoleUser = id ? id.payload.role : undefined;
        const verify = { id: verifyUser.id, role: verifyRoleUser };

        return verifyUser!==undefined ? verify : null;
      }
    } catch (err) {
      return null;
    }
  }

  // функция проверки jwt токена для teamlead
  async auntentificationAdmin(token:string) {
    try {
      const decoded = jwt.verify(token, cfg.jwt.secret, {
        ignoreExpiration: false
      });

      if (decoded) {
        const id = jwt.decode(token, { complete: true }) as JwtPayload;

        interface UserPayload {
          id: number
        }

        const verifyUser = await this.db.findUserById(id? id.payload.id : NaN) as UserPayload;
        const verifyRoleUser = id ? id.payload.role : undefined;
        const verify = { id: verifyUser.id, role: verifyRoleUser };

        return verifyUser && verifyRoleUser === 'teamlead' ? verify : null;
      }
    } catch (err) {
      return null;
    }
  }
}
