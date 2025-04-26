const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/server.ts'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'REST API',
    description: ''
  },
  host: 'localhost:8080',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'x-auth-key',
      in: 'header',
      description: 'Введите JWT токен'
    }
  },
  security: [{ BearerAuth: [] }]
};

swaggerAutogen(outputFile, endpointsFiles, doc);
