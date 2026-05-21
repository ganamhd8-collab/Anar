import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { GenerateRequestDto } from '../dto/generate-request.dto';
import { GenerateResponseDto } from '../dto/generate-response.dto';
import { GenerateService } from './generate.service';

@Controller()
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post('generate-tasks')
  @HttpCode(HttpStatus.OK)
  generateTasks(@Body() dto: GenerateRequestDto): Promise<GenerateResponseDto> {
    return this.generateService.generateTasks(dto);
  }
}
