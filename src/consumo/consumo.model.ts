import * as mongoose from 'mongoose';

export const ConsumoSchema = new mongoose.Schema({
    nameUser: { type: String, require: true },
    customerCode: { type: Number, require: true },
    consumption: { type: Number, require: true },
    consumptionDate: { type: Date, default: Date.now, require: true }

})

export interface Consumo extends mongoose.Document {
    id: number;
    nameUser: string;
    customerCode: number;
    consumption: number;
    consumptionDate: Date;
}
