import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkFlowDto, UpdateWorkFlowDto } from './dto/work-flow.create-and-update.dto';
import { Prisma, WorkFlow } from '@prisma/client';

@Injectable()
export class WorkFlowService {
    constructor(
        private prisma: PrismaService,

    ) { }

    async findAll() {
        const data = await this.prisma.workFlow.findMany({
            select: {
                id: true,
                name: true,
                sequence:true
            },
        });

        return data;
    }

    async findOne(id: number) {
        const data = await this.prisma.workFlow.findUnique({
            where: {
                id: id
            },
        }
        );

      const formateData= data.sequence;
      console.log(formateData)
      return data;
      // const formateDataArray = formateData.split(',');
      // const formateDataObject = formateDataArray.map((item) => {
      //   return {
      //     id: item,
      //     name: item,
      //   }
      // }
    }
    async create(createWorkFlowDto: CreateWorkFlowDto) {
      
      const sequenceArray = createWorkFlowDto.sequence as number[];
      const duplicates = sequenceArray.filter((item, index) => sequenceArray.indexOf(item) !== index);
    
      if (duplicates.length > 0) {
        throw new ConflictException("Duplicate Id Found")}
        const data = await this.prisma.workFlow.create({
          data: {
            name: createWorkFlowDto.name,
            sequence: createWorkFlowDto.sequence as unknown as Prisma.JsonArray
          }
        });
        return data;
      
    }

      async update(id:number,updateWorkFlowDto:UpdateWorkFlowDto)
      {
        const sequenceArray = updateWorkFlowDto.sequence as number[];
        const duplicates = sequenceArray.filter((item, index) => sequenceArray.indexOf(item) !== index);
      
        if (duplicates.length > 0) {
          throw new ConflictException("Duplicate Id Found")}
        const data = await this.prisma.workFlow.update({
            where:{id:id},
            data: {
              name: updateWorkFlowDto.name,
              sequence: updateWorkFlowDto.sequence as unknown as Prisma.JsonArray
            }
          });
          return data;
      }

      async delete(id:number)
      {
        const data=await this.prisma.workFlow.delete({
            where:{
                id:id
            }
        })
        return data;
      }
    
}
