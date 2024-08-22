const request = require('supertest');
const app = require('../../server');
// const { expect } = require('chai');
import { expect } from 'chai';

describe('Agent Controller', () => {
    let agentToken, propertyId;

    before(async () => {
        const agent = await request(app)
            .post('/api/agent/register')
            .send({ name: 'Agent', email: 'agent@agent.com', password: 'password123' });

        agentToken = agent.body.token;

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

    it('should create a property', async () => {
        const res = await request(app)
            .post('/api/agent/properties')
            .set('Authorization', `Bearer ${agentToken}`)
            .send({
                title: 'New Property',
                description: 'New Description',
                price: 600000,
                location: 'Downtown'
            });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('title');
    });

    it('should update a property', async () => {
        const res = await request(app)
            .put(`/api/agent/properties/${propertyId}`)
            .set('Authorization', `Bearer ${agentToken}`)
            .send({
                title: 'Updated Property',
                description: 'Updated Description',
                price: 700000,
                location: 'Uptown'
            });
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('Updated Property');
    });

    it('should delete a property', async () => {
        const res = await request(app)
            .delete(`/api/agent/properties/${propertyId}`)
            .set('Authorization', `Bearer ${agentToken}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Property removed');
    });
});
