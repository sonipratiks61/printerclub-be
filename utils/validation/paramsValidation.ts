import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class IdValidationPipe implements PipeTransform<string, number> {
  transform(value: string, _metadata: ArgumentMetadata) {
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException({
        result: {
          id: ['must be an integer'],
        },
        success: false,
      });
    }
    return id;
  }
}
