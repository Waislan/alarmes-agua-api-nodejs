import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';

const BEARER_SCHEME = 'access-token';

const PUBLIC_OPERATIONS: { path: string; method: string }[] = [
  { path: '/health', method: 'get' },
  { path: '/auth/login', method: 'post' },
  { path: '/auth/refresh', method: 'post' },
  { path: '/auth/logout', method: 'post' },
];

function applyBearerToProtectedRoutes(document: OpenAPIObject): void {
  const isPublic = (path: string, method: string) =>
    PUBLIC_OPERATIONS.some(
      (op) => op.path === path && op.method === method.toLowerCase(),
    );

  for (const [path, pathItem] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (method === 'parameters' || !operation || typeof operation !== 'object') {
        continue;
      }
      if (!isPublic(path, method)) {
        operation.security = [{ [BEARER_SCHEME]: [] }];
      }
    }
  }
}

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Alarmes Água API')
    .setDescription('REST API for products, sensors, detections and operators.')
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      BEARER_SCHEME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  applyBearerToProtectedRoutes(document);

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });
}
