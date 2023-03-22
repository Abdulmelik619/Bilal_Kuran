import * as mongoose from 'mongoose';

export const MarkSchema = new mongoose.Schema({
    studentId: String,
    date: String,
    scoreoutof10: Number


});

export interface Mark extends mongoose.Document{
    
         id: string;
         studentId: string;
    date: string;
    scoreoutof10: number;

    
}