import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import memoRoutes from './routes/memo.routes';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Swagger UI를 위해 CSP 비활성화
}));
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PlaceNote API Documentation',
}));

// Routes
app.use('/auth', authRoutes);
app.use('/memos', memoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
  console.log(`Swagger UI is available at http://localhost:${config.server.port}/api-docs`);
}); 