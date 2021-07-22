import { IsNotEmpty, Matches, MinLength, IsEmail } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
  
}
