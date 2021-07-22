import {BadRequestException, InternalServerErrorException, Injectable} from '@nestjs/common';
import {PasswordApiDto, ServiceType} from '../dto/password-api.dto';
import {InjectModel} from '@nestjs/mongoose';
import {Model, QueryOptions} from 'mongoose';
import {PasswordApi} from '../entity/password-api.entity';

@Injectable()
export class PasswordApiService {

    constructor(
        @InjectModel(PasswordApi.name) private readonly passwordApisModel: Model<PasswordApi>,
    ) {
    }

    async deleteService(serviceType: ServiceType): Promise<any> {
        const passwordObj = await this.passwordApisModel.deleteOne(serviceType)
        if (!passwordObj) {
            throw new BadRequestException('old password allready exist');
        }
        return;
    }

    async getPasswordObjectByService(serviceType: ServiceType): Promise<any> {
        const passwordObj = await this.passwordApisModel.findOne(serviceType);
        if (!passwordObj) {
            throw new BadRequestException('object password is not exist');
        }
        const lastPasword = passwordObj?.passwords.pop();
        return {
            service: serviceType.service,
            password: lastPasword
        }
    }

    async createAndUpdatePasswordObject(createPetDto: PasswordApiDto): Promise<any> {

        if (await this.isPasswordAllreadyExist(createPetDto)) {
            throw new BadRequestException('old password allready exist');
        } else {
            try {
                let query = {service: createPetDto.service};
                let update = {
                    $push: {
                        passwords: createPetDto.password
                    }
                };
                let options = {upsert: true, new: true, setDefaultsOnInsert: true};
                let model = await this.passwordApisModel.findOneAndUpdate(query, update, options);
                console.log(model);
            } catch (error) {
                throw new InternalServerErrorException('');
            }
        }
    }

    private async isPasswordAllreadyExist(createPetDto: PasswordApiDto) {
        return await this.passwordApisModel.findOne({
            'service': createPetDto.service,
            'passwords': {$in: [createPetDto.password]}
        }).exec();

    }
}
