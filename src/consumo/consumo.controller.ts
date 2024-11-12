import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Consumo } from './consumo.model';
import { ConsumoService } from "./consumo.service";

@Controller('consumo')
export class ConsumoController {
    constructor(private readonly consumoService: ConsumoService) { }

    @Delete('/:id')
    async deleteConsumer(@Param('id') id: number){
        await this.consumoService.deleteConsumer(id);
        return null;
    }

    // Funcao para ler os dados de consumo
    @Get()
    readAllConsumos(): Promise<any> {
        return this.consumoService.readConsumo();
    }

    // Funcao para encontrar o cliente especifico pelo ID
    @Get(':customerCode')
    getCustomerById(@Param('customerCode') customerCode: number): Promise<any> {
        return this.consumoService.getCustomerById(customerCode);
    }

    

    // Filtrar consumo por data inicial e final de um determinado usuario
    @Get('/data/:customerCode/:initialDate/:finalDate')
    filterConsumptionDate(@Param('customerCode') customerCode: number, @Param('initialDate') initialDate: String, @Param('finalDate') finalDate: String): Promise<any> {
        return this.consumoService.filterConsumptionDate(customerCode, initialDate, finalDate);
    }

    // Funcao de alertas para consumo excessivo de agua
    @Get('alert/:userId')
    async checkAlert(@Param('customerCode') customerCode: number) {
        return this.consumoService.checkAlert(customerCode);
    }

    // Funcao registrar consumo
    @Post()
    async createConsumo(@Body() consumo: Consumo): Promise<any> {
        let response = await this.consumoService.registerConsumption(consumo);
        return { id: response };
    }


}
