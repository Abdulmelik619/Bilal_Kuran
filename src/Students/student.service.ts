import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Abscent } from "./abscence.model";
import { Mark } from "./mark.model";
import { Student } from "./student.model";

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private student: Model<Student>,
        @InjectModel('Abscent') private abscent: Model<Abscent>,
        @InjectModel('Mark')  private mark: Model<Mark>,
    ){}

    async addstudent(name: string, age: number, qiratlevel: string){
        const newStudent = new this.student(
            {name, 
            age,
            qiratlevel,
    });
    const studentId =await  newStudent.save();
    return studentId;
    }

    async addabscent(studentId: string, dateofabscent: string){
        const newAbscent = new this.abscent(
            {
               studentId,
               dateofabscent 
            }
        );

        const abscentId = await newAbscent.save();
        return abscentId;
    }

   async addscore(studentId: string, date: string, scoreoutof10: number){
        const newMark = new this.mark(
            {
               studentId,
               date,
               scoreoutof10 
            }
        );

        const markId = await newMark.save();
        return markId;
    }

    async gettotalmarks(studentId: string) {
        const totalMark = await  this.mark.find({studentId: studentId});
        return totalMark;
    }

    async getallstudents(){
        const listofstudents = await this.student.find().exec();
        return listofstudents;
    }
    async getallabscentdays(studentId: string) {
        const abscentdays = await this.abscent.find({studentId: studentId});
        return abscentdays;
    }


}