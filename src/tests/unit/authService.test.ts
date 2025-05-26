
import { AuthHandler } from '../../server/handler/auth/index';
import { Database } from '../../BLL/database';
import { Jwt } from '../../DAL/jwt';
// Тип для пользователя
type MockUser = {
  id: number;
  login: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

// Мокаем зависимости с правильными типами
jest.mock('../../BLL/database', () => ({
  Database: jest.fn().mockImplementation(() => ({
    createUserToken: jest.fn<Promise<MockUser | null>, [string, string]>(),
    createUser: jest.fn<Promise<MockUser>, [string, string]>(),
    findUserById: jest.fn<Promise<MockUser | null>, [number]>()
  }))
}));

jest.mock('../../DAL/jwt', () => ({
  Jwt: jest.fn().mockImplementation(() => ({
    createToken: jest.fn<string, [number, string]>(),
    auntentification: jest.fn<Promise<MockUser | null>, [string]>()
  }))
}));

describe('AuthHandler', () => {
  let authHandler: AuthHandler;
  let mockDb: jest.Mocked<Database>;
  let mockJwt: jest.Mocked<Jwt>;
  let mockUser: MockUser;

  beforeEach(() => {
    // Инициализируем моки
    mockDb = new Database() as jest.Mocked<Database>;
    mockJwt = new Jwt(mockDb) as jest.Mocked<Jwt>;
    authHandler = new AuthHandler(mockDb, mockJwt);

    // Создаем тестового пользователя
    mockUser = {
      id: 1,
      login: 'testuser',
      password: 'hashedpassword',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    };

    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  describe('singIn', () => {
    it('should return token for valid credentials', async () => {
      // Подготовка
      mockDb.createUserToken.mockResolvedValue(mockUser);
      mockJwt.createToken.mockReturnValue('generated.token');

      // Действие
      const result = await authHandler.singIn('testuser', 'password');

      // Проверки
      expect(mockDb.createUserToken).toHaveBeenCalledWith('testuser', 'password');
      expect(mockJwt.createToken).toHaveBeenCalledWith(1, 'user');
      expect(result).toBe('generated.token');
    });

    it('should return null for invalid credentials', async () => {
      // Подготовка
      mockDb.createUserToken.mockResolvedValue(null);

      // Действие
      const result = await authHandler.singIn('invalid', 'credentials');

      // Проверки
      expect(result).toBeNull();
    });
  });

  describe('singUp', () => {
    it('should create new user and return token', async () => {
      // Подготовка
      const newUser = { ...mockUser, id: 2 };
      mockDb.createUser.mockResolvedValue(newUser);
      mockJwt.createToken.mockReturnValue('new.user.token');

      // Действие
      const result = await authHandler.singUp('newuser', 'password');

      // Проверки
      expect(mockDb.createUser).toHaveBeenCalledWith('newuser', 'password');
      expect(mockJwt.createToken).toHaveBeenCalledWith(2, 'user');
      expect(result).toBe('new.user.token');
    });

    it('should handle errors during registration', async () => {
      // Подготовка
      const error = new Error('Database error');
      mockDb.createUser.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'log');

      // Действие
      const result = await authHandler.singUp('error', 'case');

      // Проверки
      expect(consoleSpy).toHaveBeenCalledWith('error', error);
      expect(result).toBeUndefined();
    });
  });

  describe('connect', () => {
    it('should return new token for valid session', async () => {
      // Подготовка
      mockJwt.auntentification.mockResolvedValue(mockUser);
      mockJwt.createToken.mockReturnValue('refreshed.token');

      // Действие
      const result = await authHandler.connect('valid.token');

      // Проверки
      expect(mockJwt.auntentification).toHaveBeenCalledWith('valid.token');
      expect(mockJwt.createToken).toHaveBeenCalledWith(1, 'user');
      expect(result).toBe('refreshed.token');
    });

    it('should return null for invalid session', async () => {
      // Подготовка
      mockJwt.auntentification.mockResolvedValue(null);

      // Действие
      const result = await authHandler.connect('invalid.token');

      // Проверки
      expect(result).toBeNull();
    });
  });

  describe('getDate', () => {
    it('should return user data for valid token', async () => {
      // Подготовка
      mockJwt.auntentification.mockResolvedValue(mockUser);

      // Действие
      const result = await authHandler.getDate('valid.token');

      // Проверки
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid token', async () => {
      // Подготовка
      mockJwt.auntentification.mockResolvedValue(null);

      // Действие
      const result = await authHandler.getDate('invalid.token');

      // Проверки
      expect(result).toBeNull();
    });
  });

  describe('getTeamleadDate', () => {
    it('should return teamlead data for admin', async () => {
      // Подготовка
      const adminUser = { ...mockUser, role: 'admin' };
      const teamleadUser = { ...mockUser, id: 2, role: 'teamlead' };
      
      mockJwt.auntentification.mockResolvedValue(adminUser);
      mockDb.findUserById.mockResolvedValue(teamleadUser);

      // Действие
      const result = await authHandler.getTeamleadDate('admin.token', 2);

      // Проверки
      expect(mockJwt.auntentification).toHaveBeenCalledWith('admin.token');
      expect(mockDb.findUserById).toHaveBeenCalledWith(2);
      expect(result).toEqual(teamleadUser);
    });

    it('should return null for non-existing teamlead', async () => {
      // Подготовка
      const adminUser = { ...mockUser, role: 'admin' };
      mockJwt.auntentification.mockResolvedValue(adminUser);
      mockDb.findUserById.mockResolvedValue(null);

      // Действие
      const result = await authHandler.getTeamleadDate('admin.token', 999);

      // Проверки
      expect(result).toBeNull();
    });
  });
});