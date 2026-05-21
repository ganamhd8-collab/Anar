import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';

import { GenerateRequestDto } from '../dto/generate-request.dto';
import { GenerateResponseDto } from '../dto/generate-response.dto';
import { FALLBACK_TASKS } from './generate.fallback';

const REQUEST_TIMEOUT_MS = 5_000;

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);

  constructor(private readonly httpService: HttpService) {}

  async generateTasks(dto: GenerateRequestDto): Promise<GenerateResponseDto> {
    const llmApiUrl = process.env.LLM_API_URL;

    if (!llmApiUrl || llmApiUrl === 'MOCK_MODE') {
      this.logger.warn(
        `LLM_API_URL is "${llmApiUrl ?? 'empty'}" — returning fallback tasks.`,
      );
      return { tasks: FALLBACK_TASKS };
    }

    try {
      const response = await firstValueFrom(
        this.httpService
          .post<{ tasks: string[] }>(llmApiUrl, { goalText: dto.goalText })
          .pipe(timeout(REQUEST_TIMEOUT_MS)),
      );

      return { tasks: response.data.tasks };
    } catch (err) {
      if (err instanceof TimeoutError) {
        this.logger.error(
          `LLM API timed out after ${REQUEST_TIMEOUT_MS}ms — returning fallback tasks.`,
        );
      } else {
        this.logger.error(
          `LLM API request failed: ${(err as Error)?.message ?? err} — returning fallback tasks.`,
        );
      }

      return { tasks: FALLBACK_TASKS };
    }
  }
}
