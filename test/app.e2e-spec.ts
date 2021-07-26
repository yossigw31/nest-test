import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';

describe('AppController (e2e)', () => {
    async function cleanUpDb(stateServiceToDelete) {
        const response = await request(app.getHttpServer())
            .delete('/password-api')
            .set('Authorization', `Bearer ${jwtAccessToken}`)
            .send({
                "service": stateServiceToDelete,
            })
            .expect(200);
    }

    let app: INestApplication;
    let jwtAccessToken: string
    let jwtRefreshToken: string
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    })

    it('when calling to POST /auth/login with good credentials it should create new access and reresh token', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                "username": "admin",
                "password": "123456"
            })
            .expect(200);
        // save the access token for subsequent tests
        jwtAccessToken = response.body.access_token;
        jwtRefreshToken = response.body.refresh_token;
        expect(jwtAccessToken).toBeDefined();
        expect(jwtRefreshToken).toBeDefined();
        expect(jwtAccessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
    });

    it('when calling to POST /auth/login with bad credentials it should create throw 401 unauthorized', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                "username": "YossiTest",
                "password": "123456"
            })
            .expect(401)
        // save the access token for subsequent tests

        expect(response.statusCode).toEqual(401);
    });

    it('when calling to update refresh token /auth/refresh with good credentials in header it should return new access and refresh token', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${jwtRefreshToken}`)
            .expect(201);

        jwtAccessToken = response.body.access_token;
        jwtRefreshToken = response.body.refresh_token;
        expect(jwtAccessToken).toBeDefined();
        expect(jwtRefreshToken).toBeDefined();
        expect(jwtAccessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
    });

    it('when creating new password with jwt credentials it should return 201 ok', async () => {
        let stateServiceToDelete = `yossi ${new Date().toString()}`;
        try {
            const response = await request(app.getHttpServer())
                .post('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password": "1234"
                })
                .expect(201);
            expect(response.statusCode).toEqual(201);
        } finally {
            await cleanUpDb(stateServiceToDelete)
        }
    });

    it('when creating new password with bad jwt credentials it should return 400', async () => {

        const response = await request(app.getHttpServer())
            .post('/password-api')
            .set('Authorization', `Bearer Yossi Gueta`)
            .send({
                "service": `yossi ${new Date().toString()}`,
                "password": "1234"
            })
            .expect(401);
        expect(response.statusCode).toEqual(401);

    });

    it('when creating new password obj with jwt credentials for already used object it should return 400 bad request', async () => {
        let stateServiceToDelete = `yossi ${new Date().toString()}`;
        try {
            let response = await request(app.getHttpServer())
                .post('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password": "1234"
                })
                .expect(201);
            expect(response.statusCode).toEqual(201);
            response = await request(app.getHttpServer())
                .post('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password": "1234"
                })
                .expect(400);
            expect(response.statusCode).toEqual(400);
        } finally {
            await cleanUpDb(stateServiceToDelete);
        }
    });

    it('when call get for password obj api it should return the last service that created', async () => {
        let stateServiceToDelete = `yossi ${new Date().toString()}`;
        try {
            let response = await request(app.getHttpServer())
                .post('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password": "123456"
                })
                .expect(201);
            expect(response.statusCode).toEqual(201);

            response = await request(app.getHttpServer())
                .get('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                })
                .expect(200);
            expect(response.body.password).toEqual('123456');
        } finally {
            await cleanUpDb(stateServiceToDelete);
        }
    });

    it('when call update for password obj api with password that already exist for this service should return bad request', async () => {
        let stateServiceToDelete = `yossi ${new Date().toString()}`;
        try {
            let response = await request(app.getHttpServer())
                .post('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password": "123456"
                })
                .expect(201);
            expect(response.statusCode).toEqual(201);

            response = await request(app.getHttpServer())
                .put('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password":"123456"
                })
                .expect(400);
            expect(response.statusCode).toEqual(400);
            expect(response.body.message).toEqual("old password allready exist");
        } finally {
            await cleanUpDb(stateServiceToDelete);
        }
    });

    it('when call update for password obj api with password that not exist for this service should return 200', async () => {
        let stateServiceToDelete = `yossi ${new Date().toString()}`;
        try {
            let response = await request(app.getHttpServer())
                .post('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password": "123456"
                })
                .expect(201);
            expect(response.statusCode).toEqual(201);

            response = await request(app.getHttpServer())
                .put('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                    "password":"12345678"
                })
                .expect(200);
            expect(response.statusCode).toEqual(200);

            response = await request(app.getHttpServer())
                .get('/password-api')
                .set('Authorization', `Bearer ${jwtAccessToken}`)
                .send({
                    "service": stateServiceToDelete,
                })
                .expect(200);
            expect(response.body.password).toEqual('12345678');
        } finally {
            await cleanUpDb(stateServiceToDelete);
        }
    });
});
