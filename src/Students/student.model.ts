import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    qiratlevel: String,


});

export interface Student extends mongoose.Document{
    
         id: string;
         name: string;
         age: number;
         qiratlevel: string;
    
}