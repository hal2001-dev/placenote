import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PlaceNote API',
      version: '1.0.0',
      description: 'AR 위치 기반 메모 앱 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '개발 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: [path.join(__dirname, '../routes/*.ts')], // 절대 경로로 수정
};

export const swaggerSpec = swaggerJsdoc(options); 