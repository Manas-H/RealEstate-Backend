(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const server = await import('../../server'); // Adjust path as needed
    const Property = await import('../../models/Property');
    const { expect } = chai;

    chai.use(chaiHttp);

    describe('Property Controller', () => {
        let propertyId;

        before(async () => {
            await Property.default.deleteMany({});
            const property = await Property.default.create({
                title: 'Test Property',
                description: 'Test',
                price: 100000,
                location: 'Test City'
            });
            propertyId = property._id;
        });

        it('should get all properties', async () => {
            const res = await chai.request(server.default)
                .get('/api/properties');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should get property by ID', async () => {
            const res = await chai.request(server.default)
                .get(`/api/properties/${propertyId}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('title', 'Test Property');
        });
    });
})();
