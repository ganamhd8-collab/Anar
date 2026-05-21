import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateRequestDto {
  @IsString({ message: 'goalText must be a valid string' })
  @IsNotEmpty({ message: 'goalText cannot be empty' })
  goalText!: string;
}
