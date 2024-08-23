(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../../server'); // Adjust path as needed
    const Property = await import('../../models/Property');
    const Client = await import('../../models/Client');
    const { expect } = chai;

    chai.use(chaiHttp);

    describe('Client Routes', () => {
        let clientToken;
        let propertyId;

        before(async () => {
            await Client.default.deleteMany({});
            const client = await Client.default.create({ name: 'Test Client', email: 'client@test.com', password: 'password123' });
            const res = await chai.request(server.default)
                .post('/api/auth/client/login')
                .send({ email: 'client@test.com', password: 'password123' });
            clientToken = res.body.token;

            await Property.default.deleteMany({});
            const property = await Property.default.create({
                title: 'Test Property',
                description: 'Test',
                price: 100000,
                location: 'Test City'
            });
            propertyId = property._id;
        });

        it('should search for properties', async () => {
            const res = await chai.request(server.default)
                .get('/api/properties')
                .query({ location: 'Test City' });
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should express interest in a property', async () => {
            const res = await chai.request(server.default)
                .post(`/api/properties/${propertyId}/interest`)
                .set('Authorization', `Bearer ${clientToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Interest noted');
        });

        it('should get interested properties', async () => {
            const res = await chai.request(server.default)
                .get('/api/clients/interests')
                .set('Authorization', `Bearer ${clientToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });
    });
})();
