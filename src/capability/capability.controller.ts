import {
    Controller,
    Post,
    UseGuards,
    HttpException,
    HttpStatus,
    Get,
    Body,
    Delete,
    Param,
    Put,
    Res,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
import { CapabilityService } from './capability.service';
import { CreateCapabilityDto } from './dto/capability.dto';
import { UpdateCategoryDto } from 'src/category/dto/update.category.dto';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { ResponseService } from 'utils/response/customResponse';
  @Controller('capability')
  export class CapabilityController  {
    constructor(
      private readonly capabilityService: CapabilityService,
      private readonly responseService: ResponseService,
    ) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() createCapabilitiesDto: CreateCapabilityDto,@Res() res) {
      try {
        await this.capabilityService.create(createCapabilitiesDto);
        this.responseService.sendSuccess(res, "Created Successfully");
      } catch (error) {
        console.error(error);
       
          this.responseService.sendInternalError(
            res,
            error.message|| 'Something Went Wrong',
          );
        
      }
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async fetchAll(
      @Res() res
    ) {
      try {
       const data = await this.capabilityService.findAll();
        this.responseService.sendSuccess(res, "Fetched Successfully",data);
      } catch (error) {
        console.error(error);
       
          this.responseService.sendInternalError(
            res,
            error.message|| 'Something Went Wrong',
          );
        
      }
    }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const capabilityId = parseInt(id, 10);
      const capability = await this.capabilityService.findOne(capabilityId);
      if (!capability) {
        this.responseService.sendNotFound(
          res,
          "capabilityId Invalid",
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', capability);
    } catch (error) {
      console.log(error);
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
        );
        return;
      }
    }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res,
  ) {
    try {
      const capabilityId = parseInt(id, 10);
      const capability = await this.capabilityService.findOne(capabilityId);
      if (!capability) {
        this.responseService.sendNotFound(
          res,
          'Invalid CapabilityId',
        );
      }
      const updatedCategory = await this.capabilityService.update(
        capabilityId,
        updateCategoryDto,
      );
      this.responseService.sendSuccess(
        res,
        'Capability Updated Successfully',
        updatedCategory,
      );
    } catch (error) {
      console.log(error);
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
        
        );
      
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const capabilityId = parseInt(id, 10);
    try {
      const capability = await this.capabilityService.findOne(capabilityId);
      if (!capability) {
        this.responseService.sendNotFound(
          res,
          'Invalid capabilityId',
        );
      }
      await this.capabilityService.delete(capabilityId);
      this.responseService.sendSuccess(res, 'Capability Deleted Successfully');
    } catch (error) {
      console.error(error);
     
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
        );
      }
    }
  }
  