import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './produit/produit.module';

// FIND ALL USERS
// ADD USER
// DELETE USER

// ADD TODO BASED ON USER ID
// FIND ALL TODOS BASED ON USER ID (NOT COMPLETED)
// FIND ALL COMPLETED TODOS BASED ON USER ID (COMPLETED)
// MARK TODO AS COMPLETED BASED ON TODO ID
// DELETE TODO  BASED ON TODO ID

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      synchronize: true,
      database: 'azasnikrs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    AuthModule,
    ProductsModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
