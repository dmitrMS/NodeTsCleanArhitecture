import { TaskHandler } from '../../server/handler/task';
import { Database } from '../../BLL/database';
import { Jwt } from '../../DAL/jwt';

const mockUser = { id: 1, role: 'user' };

const mockTask = {
  id: 1,
  name: 'Test Task',
  description: 'Test Description',
  status_id: 1,
  priority_id: 2,
  project_id: 101,
  begin_date: new Date(),
  end_date: new Date(),
  author_id: 1,
  executor_id: 2,
  created_at: new Date(),
  updated_at: new Date(),
};

jest.mock('../../BLL/database', () => ({
  Database: jest.fn().mockImplementation(() => ({
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    // getTeamTasks: jest.fn(), // добавить, если реализуешь метод list
  })),
}));

jest.mock('../../DAL/jwt', () => ({
  Jwt: jest.fn().mockImplementation(() => ({
    auntentification: jest.fn(),
  })),
}));

describe('TaskHandler', () => {
  let db: jest.Mocked<Database>;
  let jwt: jest.Mocked<Jwt>;
  let handler: TaskHandler;

  beforeEach(() => {
    db = new Database() as jest.Mocked<Database>;
    jwt = new Jwt(db) as jest.Mocked<Jwt>;
    handler = new TaskHandler(db, jwt);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create task if authenticated', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.createTask.mockResolvedValue(mockTask);

      const result = await handler.create('token123', mockTask.name, mockTask.project_id);

      expect(jwt.auntentification).toHaveBeenCalledWith('token123');
      expect(db.createTask).toHaveBeenCalledWith(mockTask.name, mockTask.project_id, mockUser.id);
      expect(result).toEqual(mockTask);
    });

    it('should return null if not authenticated', async () => {
      jwt.auntentification.mockResolvedValue(null);

      const result = await handler.create('bad.token', 'Task name', 100);

      expect(result).toBeNull();
      expect(db.createTask).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update task if authenticated', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.updateTask.mockResolvedValue(mockTask);

      const result = await handler.update(
        'token',
        mockTask.id,
        mockTask.name,
        mockTask.description!,
        mockTask.status_id!,
        mockTask.priority_id!,
        mockTask.begin_date!,
        mockTask.end_date!,
        mockTask.executor_id!
      );

      expect(jwt.auntentification).toHaveBeenCalledWith('token');
      expect(db.updateTask).toHaveBeenCalledWith(
        mockTask.id,
        mockTask.name,
        mockTask.description,
        mockTask.status_id,
        mockTask.priority_id,
        mockTask.begin_date,
        mockTask.end_date,
        mockTask.executor_id
      );
      expect(result).toEqual(mockTask);
    });

    it('should return null if not authenticated', async () => {
      jwt.auntentification.mockResolvedValue(null);

      const result = await handler.update(
        'bad.token',
        1,
        'task',
        'desc',
        1,
        1,
        new Date(),
        new Date(),
        2
      );

      expect(result).toBeNull();
      expect(db.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete task if authenticated', async () => {
      jwt.auntentification.mockResolvedValue(mockUser);
      db.deleteTask.mockResolvedValue(null);

      const result = await handler.delete('token', mockTask.id);

      expect(jwt.auntentification).toHaveBeenCalledWith('token');
      expect(db.deleteTask).toHaveBeenCalledWith(mockTask.id);
      expect(result).toBeNull();
    });

    it('should return null if not authenticated', async () => {
      jwt.auntentification.mockResolvedValue(null);

      const result = await handler.delete('token', mockTask.id);

      expect(result).toBeNull();
      expect(db.deleteTask).not.toHaveBeenCalled();
    });
  });
});
