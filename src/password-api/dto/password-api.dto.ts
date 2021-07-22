import { IsNotEmpty, Matches, MinLength, IsEmail } from 'class-validator';

export class PasswordApiDto {
  @IsNotEmpty()
  readonly service: string;

  @IsNotEmpty()
  readonly password: string;
  
}
export class ServiceType {
  @IsNotEmpty()
  readonly service: string;
}