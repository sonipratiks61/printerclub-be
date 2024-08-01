import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
  Param,
  NotFoundException,
  Delete,
  Patch,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseService } from 'utils/response/customResponse';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { WorkFlowService } from './work-flow.service';
import { CreateWorkFlowDto, UpdateWorkFlowDto } from './dto/work-flow.create-and-update.dto';

@Controller('workflow')
export class WorkFlowController {
  constructor(
    private readonly workFlowService: WorkFlowService,
    private readonly responseService: ResponseService,
  ) { }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
    type: CreateWorkFlowDto,
  })
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createWorkFlowDto: CreateWorkFlowDto, @Res() res) {
    try {
      const data = await this.workFlowService.create(createWorkFlowDto);
      if (data) {
        this.responseService.sendSuccess(res, 'WorkFlow Create Successfully');
      } else {
        this.responseService.sendBadRequest(res, 'Failed to WorkFlow Create');
      }

    } catch (error) {
      if (error instanceof ConflictException) {
        this.responseService.sendConflict(res, error.message);
      }
      else if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Get()
  async fetchAll(@Res() res) {
    try {
      const data = await this.workFlowService.findAll();
      this.responseService.sendSuccess(res, 'Fetch Successfully!', data);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
        error,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const workFlowId = parseInt(id, 10);
      const workFlow = await this.workFlowService.findOne(workFlowId);
      if (!workFlow) {
        this.responseService.sendNotFound(res, 'Invalid Workflow Id ');
      }
      if (workFlow) {
        this.responseService.sendSuccess(res, 'Workflow Fetch Successfully', workFlow);
      } else {
        this.responseService.sendBadRequest(res, 'Failed to Workflow Fetch');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      }
      else {
        this.responseService.sendInternalError(res, 'Something Went Wrong');
      }
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const workFlowId = parseInt(id, 10);
    try {
      const workFlow = await this.workFlowService.findOne(workFlowId);
      if (!workFlow) {
        this.responseService.sendNotFound(res, 'Workflow not found');
      }
      const data = await this.workFlowService.delete(workFlowId);
      if (data) {
        this.responseService.sendSuccess(res, 'Workflow Deleted Successfully');
      } else {
        this.responseService.sendBadRequest(res, 'Failed to Workflow Delete');
      }
    } catch (error) {
      this.responseService.sendInternalError(res, 'Something Went Wrong');
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateWorkFlow(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateWorkFlowDto: UpdateWorkFlowDto,
    @Res() res,
  ) {
    try {
      const workFlowId = parseInt(id, 10);
      const workFlow = await this.workFlowService.findOne(workFlowId);
      if (!workFlow) {
        this.responseService.sendNotFound(res, 'Workflow not found');
      }
      const data = await this.workFlowService.update(workFlowId, updateWorkFlowDto)
      this.responseService.sendSuccess(res, 'Updated WorkFlow Successfully', data)
    } catch (error) {
      if (error instanceof ConflictException) {
        this.responseService.sendConflict(res, error.message);
      }
      else if (error instanceof NotFoundException) {
        this.responseService.sendBadRequest(res, error.message);
      }
      else {
        this.responseService.sendInternalError(res, 'Something Went Wrong');
      }
    }
  }
}
