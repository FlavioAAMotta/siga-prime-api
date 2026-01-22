
import request from 'supertest';
import express from 'express';
import preceptoresRouter from '../src/routes/preceptoresRouter';

// Mock the database classes to prevent real DB calls
jest.mock('../src/data/PreceptoresDatabase', () => {
    return {
        PreceptoresDatabase: jest.fn().mockImplementation(() => ({
            create: jest.fn().mockResolvedValue({ id: 'mock-preceptor-id', nome: 'Test' }),
            update: jest.fn().mockResolvedValue(undefined),
            findById: jest.fn().mockResolvedValue({ id: '123', email: 'test@example.com' }), // Mock finding a preceptor
        }))
    };
});

jest.mock('../src/data/UserDatabase', () => {
    return {
        UserDatabase: jest.fn().mockImplementation(() => ({
            findUserByEmail: jest.fn().mockResolvedValue(null), // User doesn't exist
            insertUser: jest.fn().mockResolvedValue(undefined),
            insertUserRole: jest.fn().mockResolvedValue(undefined),
            activateUserInstitution: jest.fn().mockResolvedValue(undefined),
        }))
    };
});

// Mock services
jest.mock('../src/services/IdGenerator', () => {
    return {
        IdGenerator: jest.fn().mockImplementation(() => ({
            generate: jest.fn().mockReturnValue('mock-id')
        }))
    };
});

jest.mock('../src/services/HashManager', () => {
    return {
        HashManager: jest.fn().mockImplementation(() => ({
            hash: jest.fn().mockResolvedValue('hashed-password')
        }))
    };
});

const app = express();
app.use(express.json());
app.use('/preceptores', preceptoresRouter);

describe('Preceptores API', () => {
    describe('POST /preceptores/register', () => {
        it('should create a new preceptor user successfully', async () => {
            const response = await request(app)
                .post('/preceptores/register')
                .send({
                    nome: 'Dr. Test',
                    usuario: 'drtest',
                    email: 'test@example.com',
                    ativo: true,
                    instituicaoId: 'inst-123'
                });

            expect(response.status).toBe(201);
            // expect(response.body).toHaveProperty('message', 'Preceptor created successfully'); 
            // The consolidated create method returns { data: ... } standard response format
            expect(response.body.data).toHaveProperty('id', 'mock-preceptor-id');
        });

        it('should fail if email is missing', async () => {
            const response = await request(app)
                .post('/preceptores/register')
                .send({
                    nome: 'Dr. No Email',
                    usuario: 'noemail'
                });

            expect(response.status).toBe(400);
            // Actual error message depends on logic, but we expect error
        });
    });

    describe('PATCH /preceptores/:id/details', () => {
        it('should update preceptor details', async () => {
            const response = await request(app)
                .patch('/preceptores/123/details')
                .send({
                    nome: 'Dr. Updated',
                    telefone: '123456789'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Updated');
        });
    });
});
