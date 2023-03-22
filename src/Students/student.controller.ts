import { Body, Controller, Post, Get } from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller('student')
export class StudentController{
    constructor(private readonly studentservice: StudentService) {} 

    @Post('addstudent')
    async createstudent(
        @Body('name') studentName: string,
        @Body('age')  studentAge: number,
        @Body('qiratlevel') studentQiratlevel: string,
    ){
        const generatedId = await this.studentservice.addstudent(
            studentName,
            studentAge,
            studentQiratlevel,
        );
        return {id: generatedId};
    }

    @Post('addabscent')
    async addabscent(
        @Body('studentId') studentId: string,
        @Body('dateofabscent') dateofabscent: string,
    ){
       const abscentId = await this.studentservice.addabscent(
           studentId,
           dateofabscent 
        );

        return {id: abscentId};

    }

    @Post('addscore')
    async addscore(
        @Body('studentId') studentId: string,
        @Body('date') date: string,
        @Body('scoreoutof10') score: number,        
        ){
        const markId = await this.studentservice.addscore(
            studentId,
            date,
            score
         );
        return {id: markId};
        
    }

    @Get('gettotalmark')
    async gettotalmarks(
        @Body('studentId') studentId: string,
    ){
        const totalmarks = await this.studentservice.gettotalmarks(studentId);
        return totalmarks;
    }

    @Get('getallstudents')
    async getallstudents(){
       const allstudents = await this.studentservice.getallstudents();
       return allstudents;
    }

    @Get('getallabscentdays')
    async getallabscentdays(
        @Body('studentId') studentId: string,
    ){
        const abscentdays = await this.studentservice.getallabscentdays(studentId);
        return abscentdays;

    }
    //dgfdgghj


}