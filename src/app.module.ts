import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductsService } from './modules/products/products.service';
import { CategoriesService } from './modules/categories/categories.service';
import { Categories } from './entities/categories.entity';
import { Products } from './entities/products.entity';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    //*Establece la conexión global en la aplicación. forRoot proporciona opciones adicionales a la configuración.
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    //*Configura la conexión a la BD de manera asincrona.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    FileUploadModule,
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([Categories, Products]),
  ],
  controllers: [],
  providers: [CategoriesService, ProductsService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}
  async onApplicationBootstrap() {
    await this.categoriesService.addCategories();
    await this.productsService.addProducts();
  }
}
