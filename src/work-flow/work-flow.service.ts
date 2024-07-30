import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkFlowDto, UpdateWorkFlowDto } from './dto/work-flow.create-and-update.dto';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkFlowService {
  constructor(
    private prisma: PrismaService,
    private orderStatusService: OrderStatusService

  ) { }

  async create(createWorkFlowDto: CreateWorkFlowDto) {
    const sequenceArray = createWorkFlowDto.sequence as number[];
    const duplicates = sequenceArray.filter((item, index) => sequenceArray.indexOf(item) !== index);

    if (duplicates.length > 0) {
      throw new ConflictException("Duplicate Id Found")
    }
    const formateData: number[] = Array.isArray(createWorkFlowDto.sequence) ?
      createWorkFlowDto.sequence.filter(item => typeof item === 'number') as number[] : [];

    await Promise.all(formateData.map(async (i: number) => {
      const formate = await this.orderStatusService.findOne(i);
      if (!formate) {
        throw new NotFoundException('Invalid Order Status');
      }
      return {
        id: formate?.id,
        status: formate?.status,
      };
    }));

    const data = await this.prisma.workFlow.create({
      data: {
        name: createWorkFlowDto.name,
        sequence: createWorkFlowDto.sequence as unknown as Prisma.JsonArray
      }
    });

    return data;

  }

  async findAll() {
    const workflows = await this.prisma.workFlow.findMany({
      select: {
        id: true,
        name: true,
        sequence: true
      },
    });
  
    const processedWorkflows = await Promise.all(workflows.map(async workflow => {
      const sequence = Array.isArray(workflow.sequence) ?
        workflow.sequence.filter(item => typeof item === 'number') : [];
  
      const formateDataArray = await Promise.all(sequence.map(async (i: number) => {
        const formate = await this.orderStatusService.findOne(i);
        return {
          id: formate?.id,
          status: formate?.status,
        };
      }));
  
      return {
        ...workflow,
        sequence: formateDataArray
      };
    }));
  
    return processedWorkflows;
  }
  
  async findOne(id: number) {
    const data = await this.prisma.workFlow.findUnique({
      where: {
        id: id
      },
      select: {
        id: true, name: true, sequence: true
      }
    });
    if (!data) {
      throw new NotFoundException('Work Flow not found');
    }

    const formateData: number[] = Array.isArray(data.sequence) ?
      data.sequence.filter(item => typeof item === 'number') as number[] : [];

    const formateDataArray = await Promise.all(formateData.map(async (i: number) => {
      const formate = await this.orderStatusService.findOne(i);
      return {
        id: formate?.id,
        status: formate?.status,
      };
    }));
    return {
      id: data.id, name: data.name,
      sequence: formateDataArray,
    };
  }

  async update(id: number, updateWorkFlowDto: UpdateWorkFlowDto) {
    const sequenceArray = updateWorkFlowDto.sequence as number[];
    const duplicates = sequenceArray.filter((item, index) => sequenceArray.indexOf(item) !== index);

    if (duplicates.length > 0) {
      throw new ConflictException("Duplicate Id Found")
    }
    const formateData: number[] = Array.isArray(updateWorkFlowDto.sequence) ?
      updateWorkFlowDto.sequence.filter(item => typeof item === 'number') as number[] : [];

    await Promise.all(formateData.map(async (i: number) => {
      const formate = await this.orderStatusService.findOne(i);
      if (!formate) {
        throw new NotFoundException('Invalid Order status');
      }
      return {
        id: formate?.id,
        status: formate?.status,
      };
    }));

    const data = await this.prisma.workFlow.update({
      where: { id: id },
      data: {
        name: updateWorkFlowDto.name,
        sequence: updateWorkFlowDto.sequence as unknown as Prisma.JsonArray
      }
    });
    return data;
  }

  async delete(id: number) {
    const data = await this.prisma.workFlow.delete({
      where: {
        id: id
      }
    })
    return data;
  }

}
