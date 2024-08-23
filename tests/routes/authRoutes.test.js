(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../../server'); // Adjust path as needed
    const Agent = await import('../../models/Agent');
    const Client = await import('../../models/Client');
    const { expect } = chai;

    chai.use(chaiHttp);

    describe('Auth Routes', () => {
        it('should register and login agent', async () => {
            const res = await chai.request(server.default)
                .post('/api/auth/agent/register')
                .send({ name: 'Test Agent', email: 'agent@test.com', password: 'password123' });
            expect(res).to.have.status(200);

            const loginRes = await chai.request(server.default)
                .post('/api/auth/agent/login')
                .send({ email: 'agent@test.com', password: 'password123' });
            expect(loginRes).to.have.status(200);
            expect(loginRes.body).to.have.property('token');
        });

        it('should register and login client', async () => {
            const res = await chai.request(server.default)
                .post('/api/auth/client/register')
                .send({ name: 'Test Client', email: 'client@test.com', password: 'password123' });
            expect(res).to.have.status(200);

            const loginRes = await chai.request(server.default)
                .post('/api/auth/client/login')
                .send({ email: 'client@test.com', password: 'password123' });
            expect(loginRes).to.have.status(200);
            expect(loginRes.body).to.have.property('token');
        });
    });
})();
