const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');

describe('Authentication Controller', () => {
    it('should register an agent', async () => {
        const res = await request(app)
            .post('/api/agent/register')
            .send({
                name: 'Agent Name',
                email: 'agent@example.com',
                password: 'password123'
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });

    it('should login an agent', async () => {
        const res = await request(app)
            .post('/api/agent/login')
            .send({
                email: 'agent@example.com',
                password: 'password123'
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });

    it('should register a client', async () => {
        const res = await request(app)
            .post('/api/client/register')
            .send({
                name: 'Client Name',
                email: 'client@example.com',
                password: 'password123'
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });

    it('should login a client', async () => {
        const res = await request(app)
            .post('/api/client/login')
            .send({
                email: 'client@example.com',
                password: 'password123'
            });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });
});
