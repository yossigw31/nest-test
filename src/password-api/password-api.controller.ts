import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {PasswordApiDto, ServiceType} from './dto/password-api.dto';
import {PasswordApiService} from './service/password-api.service';

@Controller('password-api')
export class PasswordApiController {
    constructor(private readonly passwordApiService: PasswordApiService) {
    }

    @Post()
    @UseGuards(AuthGuard())
    async createPasswordObj(@Body() createPetDto: PasswordApiDto): Promise<void> {
        return await this.passwordApiService.createAndUpdatePasswordObject(createPetDto);
    }

    @Get()
    @UseGuards(AuthGuard())
    async getPasswordObjByServiceType(@Body() service: ServiceType): Promise<PasswordApiDto> {
        return await this.passwordApiService.getPasswordObjectByService(service);
    }

    @Put()
    @UseGuards(AuthGuard())
    async updatePasswordObj(@Body() createPetDto: PasswordApiDto): Promise<void> {
        return await this.passwordApiService.createAndUpdatePasswordObject(createPetDto);
    }

    @Delete()
    @UseGuards(AuthGuard())
    async deletePasswordObj(@Body() service: ServiceType): Promise<void> {
        return await this.passwordApiService.deleteService(service);
    }

}
