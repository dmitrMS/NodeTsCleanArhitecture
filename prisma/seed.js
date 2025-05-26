const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // const worker = await prisma.user.upsert({
  //   where: { id: 1 }, // Условие поиска
  //   update: {}, // Пока не обновляем
  //   create: {
  //     login: 'worker',
  //     password: 'worker',
  //     role: 'worker',
  //     created_at: new Date('2024-02-27T00:00:00.000Z'),
  //     updated_at: new Date('2024-02-28T00:00:00.000Z'),
  //     work_time: {
  //       create: {
  //         task_name: 'поработать',
  //         begin_date: new Date('2024-02-27T00:00:00.000Z'),
  //         end_date: new Date('2024-02-28T00:00:00.000Z'),
  //         created_at: new Date('2024-02-27T00:00:00.000Z'),
  //         updated_at: new Date('2024-02-28T00:00:00.000Z')
  //       }
  //     }
  //   }
  // });

  // const dmitry = await prisma.user.upsert({
  //   where: { id: 2 },
  //   update: {},
  //   create: {
  //     login: 'dmitry',
  //     password: 'P@ssw0rd',
  //     role: 'teamlead',
  //     created_at: new Date('2024-02-27T00:00:00.000Z'),
  //     updated_at: new Date('2024-02-28T00:00:00.000Z'),
  //     work_time: {
  //       create: [
  //         {
  //           task_name: 'поделать диплом',
  //           begin_date: new Date('2024-02-27T00:00:00.000Z'),
  //           end_date: new Date('2024-02-28T00:00:00.000Z'),
  //           created_at: new Date('2024-02-27T00:00:00.000Z'),
  //           updated_at: new Date('2024-02-28T00:00:00.000Z')
  //         },
  //         {
  //           task_name: 'погулять',
  //           begin_date: new Date('2024-03-01T00:00:00.000Z'),
  //           end_date: new Date('2024-03-02T00:00:00.000Z'),
  //           created_at: new Date('2024-03-01T00:00:00.000Z'),
  //           updated_at: new Date('2024-03-02T00:00:00.000Z')
  //         }
  //       ]
  //     }
  //   }
  // });

  const roles = await prisma.role.createMany({
    data: [
      {
        id: 1,
        name: 'Head',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 2,
        name: 'Аналитик',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 3,
        name: 'Тестировщик',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 4,
        name: 'Программист',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      }
    ],
    skipDuplicates: true // Пропускать дубликаты
  });

  const statuses = await prisma.status.createMany({
    data: [
      {
        id: 1,
        name: 'Принято',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 2,
        name: 'Выполняется',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 3,
        name: 'Завершено',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      }
    ],
    skipDuplicates: true // Пропускать дубликаты
  });

  const priority = await prisma.priority.createMany({
    data: [
      {
        id: 1,
        name: 'Низкий',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 2,
        name: 'Средний',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      },
      {
        id: 3,
        name: 'Высокий',
        created_at: new Date('2024-03-01T00:00:00.000Z'),
        updated_at: new Date('2024-03-02T00:00:00.000Z')
      }
    ],
    skipDuplicates: true // Пропускать дубликаты
  });

  // console.log({ worker, dmitry });
  console.log({ roles, statuses, priority });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
