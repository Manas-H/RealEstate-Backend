(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../../server.js'); // Adjust path as needed
    const { expect } = chai;

    chai.use(chaiHttp);

    describe('Auth Routes', () => {
        let agentToken;
        let clientToken;

        before(async () => {
            // Register and login an agent
            await chai.request(server.default)
                .post('/api/auth/agent/register')
                .send({ name: 'Test Agent', email: 'agent@test.com', password: 'password123' });
            const agentRes = await chai.request(server.default)
                .post('/api/auth/agent/login')
                .send({ email: 'agent@test.com', password: 'password123' });
            agentToken = agentRes.body.token;

            // Register and login a client
            await chai.request(server.default)
                .post('/api/auth/client/register')
                .send({ name: 'Test Client', email: 'client@test.com', password: 'password123' });
            const clientRes = await chai.request(server.default)
                .post('/api/auth/client/login')
                .send({ email: 'client@test.com', password: 'password123' });
            clientToken = clientRes.body.token;
        });

        it('should register and login an agent', async () => {
            expect(agentToken).to.be.a('string');
        });

        it('should register and login a client', async () => {
            expect(clientToken).to.be.a('string');
        });

        it('should get properties with agent authentication', async () => {
            const res = await chai.request(server.default)
                .get('/api/agents/properties')
                .set('Authorization', `Bearer ${agentToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should not access agent properties with client authentication', async () => {
            const res = await chai.request(server.default)
                .get('/api/agents/properties')
                .set('Authorization', `Bearer ${clientToken}`);
            expect(res).to.have.status(403); // Assuming that clients are not allowed to access agent properties
        });
    });
})();
