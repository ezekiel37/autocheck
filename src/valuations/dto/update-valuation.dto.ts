import { PartialType } from '@nestjs/mapped-types';
import { CreateValuationDto } from './create-valuation.dto';

export class UpdateValuationDto extends PartialType(CreateValuationDto) {}
