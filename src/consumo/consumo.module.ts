import { Module } from '@nestjs/common';
import { ConsumoController } from './consumo.controller';
import { ConsumoService } from './consumo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumoSchema } from "./consumo.model";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Consumo', schema: ConsumoSchema }])],
  controllers: [ConsumoController],
  providers: [ConsumoService]
})
export class ConsumoModule { }
