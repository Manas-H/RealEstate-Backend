(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../../server'); // Adjust path as needed
    const Agent = await import('../../models/Agent');
    const Property = await import('../../models/Property');
    const { expect } = chai;

    chai.use(chaiHttp);

    describe('Agent Controller', () => {
        let agentToken;
        let propertyId;

        before(async () => {
            await Agent.default.deleteMany({});
            const agent = await Agent.default.create({ name: 'Test Agent', email: 'agent@test.com', password: 'password123' });
            const res = await chai.request(server.default)
                .post('/api/auth/agent/login')
                .send({ email: 'agent@test.com', password: 'password123' });
            agentToken = res.body.token;

            await Property.default.deleteMany({});
            const property = await Property.default.create({
                title: 'Test Property',
                description: 'Test',
                price: 100000,
                location: 'Test City',
                agent: agent._id
            });
            propertyId = property._id;
        });

        it('should get all properties for an agent', async () => {
            const res = await chai.request(server.default)
                .get('/api/agents/properties')
                .set('Authorization', `Bearer ${agentToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should create a new property', async () => {
            const res = await chai.request(server.default)
                .post('/api/agents/properties')
                .set('Authorization', `Bearer ${agentToken}`)
                .send({ title: 'New Property', description: 'New', price: 200000, location: 'New City' });
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('title', 'New Property');
        });

        it('should update an existing property', async () => {
            const res = await chai.request(server.default)
                .put(`/api/agents/properties/${propertyId}`)
                .set('Authorization', `Bearer ${agentToken}`)
                .send({ title: 'Updated Property', description: 'Updated', price: 150000, location: 'Updated City' });
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('title', 'Updated Property');
        });

        it('should delete a property', async () => {
            const res = await chai.request(server.default)
                .delete(`/api/agents/properties/${propertyId}`)
                .set('Authorization', `Bearer ${agentToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Property removed');
        });
    });
})();
