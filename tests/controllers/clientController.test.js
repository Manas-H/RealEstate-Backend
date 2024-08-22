const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');

describe('Client Controller', () => {
    let clientToken, propertyId;

    before(async () => {
        const client = await request(app)
            .post('/api/client/register')
            .send({ name: 'Client', email: 'client@client.com', password: 'password123' });

        clientToken = client.body.token;

        const agent = await request(app)
            .post('/api/agent/register')
            .send({ name: 'Agent', email: 'agent@agent.com', password: 'password123' });

        const agentToken = agent.body.token;

        const property = await request(app)
            .post('/api/agent/properties')
            .set('Authorization', `Bearer ${agentToken}`)
            .send({
                title: 'Property Title',
                description: 'Property Description',
                price: 500000,
                location: 'City Center'
            });

        propertyId = property.body._id;
    });

    it('should allow a client to express interest in a property', async () => {
        const res = await request(app)
            .post(`/api/properties/${propertyId}/interest`)
            .set('Authorization', `Bearer ${clientToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Interest noted');
    });

    it('should return the properties a client is interested in', async () => {
        const res = await request(app)
            .get('/api/interests')
            .set('Authorization', `Bearer ${clientToken}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });
});
