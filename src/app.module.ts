import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumoModule } from './consumo/consumo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConsumoModule, MongooseModule.forRoot('<Usuário><Senha>')], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
