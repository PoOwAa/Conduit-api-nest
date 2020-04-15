import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/appConfig.service';

async function bootstrap() {
  const appOptions: NestApplicationOptions = {
    cors: true,
    bodyParser: true,
  };
  const app = await NestFactory.create(AppModule, appOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const appConfig: AppConfigService = app.get('AppConfigService');
  // Swagger docs
  const options = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setBasePath('/api')
    .setDescription('Conduit API')
    .setVersion('1.0.0')
    .setLicense('The MIT License', 'https://opensource.org/licenses/MIT')
    // .setContact(
    //   'Raymund Ács',
    //   'https://github.com/PoOwAa',
    //   'raycsucsu@gmail.com',
    // )
    .setContact('RealWorld', 'https://realworld.io', '')
    .addBearerAuth(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'Token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    customCss: '.swagger-ui .topbar { background: #282C37; }',
    customSiteTitle: 'Conduit API',
  });

  await app.listen(appConfig.port);
}
bootstrap();
