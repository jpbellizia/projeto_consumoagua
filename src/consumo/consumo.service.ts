import { Injectable, NotFoundException } from '@nestjs/common';
import { Consumo } from "./consumo.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class ConsumoService {
    constructor(@InjectModel('Consumo') private readonly consumoModel: Model<Consumo>) { }

    // Registro de Consumo de Água
    async registerConsumption(consumo: Consumo) {
        const consumoModel = new this.consumoModel({
            nameUser: consumo.nameUser,
            customerCode: consumo.customerCode,
            consumption: consumo.consumption,
            consumptionDate: consumo.consumptionDate,
        });
        const result = await consumoModel.save();
        return result.id as string;
    }

    // Encontrar cliente por ID
    async getCustomerById(customerCode: number) {
        const infosConsumo = await this.consumoModel.find({ customerCode: customerCode }).exec();
        if (!infosConsumo) {
            throw new NotFoundException(`Customer with code ${customerCode} not found`);
        }
        console.log(customerCode)
        return infosConsumo;
    }

    // Consulta de Histórico de Consumo
    async filterConsumptionDate(customerCode: number, initialDate: String, finalDate: String) {

        // Verificar se as datas estão em formato válido
        const startDate = new Date(`${initialDate}T00:00:00Z`);
        const endDate = new Date(`${finalDate}T23:59:59Z`);

        // Validar se as datas criadas são válidas
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Datas inválidas fornecidas. Por favor, utilize o formato YYYY-MM-DD.');
        }

        // Executar a consulta no intervalo especificado
        try {
            const consumerSelectedDate = await this.consumoModel.find({
                customerCode: customerCode,
                consumptionDate: { $gte: startDate, $lt: endDate }
            }).exec();

            return consumerSelectedDate;
        } catch (error) {
            console.error('Erro ao buscar dados no intervalo de datas:', error);
            throw new Error('Erro ao buscar dados no intervalo de datas.');
        }
    }

    // Ler consumos cadastrados
    async readConsumo() {
        const consumo = await this.consumoModel.find().exec();
        return consumo.map(consumo => ({
            id: consumo.id,
            nameUser: consumo.nameUser,
            customerCode: consumo.customerCode,
            consumption: consumo.consumption,
            consumptionDate: consumo.consumptionDate,
        }));
    }

    // Alertas de Consumo Elevado
    async checkAlert(customerCode: number) {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
        // Verifique se as datas são válidas
        if (isNaN(startOfThisMonth.getTime()) || isNaN(startOfLastMonth.getTime())) {
            throw new Error('Erro ao calcular as datas. Uma ou mais datas são inválidas.');
        }
    
        try {
            // Buscar o registro de consumo do último mês
            const lastMonthConsumption = await this.consumoModel
                .findOne({
                    customerCode,
                    consumptionDate: { $gte: startOfLastMonth, $lt: startOfThisMonth }
                })
                .exec();
    
                
                if (!lastMonthConsumption) {
                    return null; // Sem dados suficientes para gerar um alerta
                }
                console.log('Last Month Consumption:', lastMonthConsumption.consumption);
    
            // Obter o consumo do mês atual
            const currentMonthConsumption = await this.consumoModel
                .findOne({
                    customerCode,
                    consumptionDate: { $gte: startOfThisMonth }
                })
                .exec();
   if (!currentMonthConsumption) {
                    return null; // Sem consumo registrado no mês atual
                }
                console.log('Current Month Consumption:', currentMonthConsumption.consumption);
    
            // Comparação: consumo atual maior que o do último mês
            if (currentMonthConsumption.consumption > lastMonthConsumption.consumption) {
                return 'Alerta: Consumo alto! O consumo deste mês é maior que o do mês passado.';
            }
    
            return null; // Sem alerta
        } catch (error) {
            console.error('Erro ao buscar consumos:', error);
            throw new Error('Erro ao buscar dados de consumo.');
        }
    }

    // Deletar id de registro
    async deleteConsumer(id: number){
        const result = await this.consumoModel.deleteOne({_id: id}); 
    }
}
