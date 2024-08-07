import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('NAVARRO grocery point of sale')
  .setDescription('back end of the Point of sale for my grocery store developed with nestjs')
  .setVersion('1.0')
  .addTag('point sale')
  .build();
const document = SwaggerModule.createDocument(app, config);
//SwaggerModule.setup('api', app, document);
  // Define el orden deseado de las etiquetas
 /*
 const customTagsOrder = [ 'Orders','Users', 'Products'];

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: (tag1, tag2) => {
        // Obtén los índices de las etiquetas en el array customTagsOrder
        const index1 = customTagsOrder.indexOf(tag1);
        const index2 = customTagsOrder.indexOf(tag2);
        // Si la etiqueta no está en customTagsOrder, colócala al final
        return (index1 === -1 ? customTagsOrder.length : index1) - (index2 === -1 ? customTagsOrder.length : index2);
      }
    }
  });
 */
  

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.useGlobalPipes(new ValidationPipe())
  app.use(loggerGlobal);
  await app.listen(3000);
}
bootstrap();
