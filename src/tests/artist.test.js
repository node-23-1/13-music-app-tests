const request = require('supertest');
const app = require('../app');
const Genre = require('../models/Genre');
require('../models');

let artistId;

test('POST /artists', async () => {
    const artist = {
        name: "Bruno Mars",
        formationYear: 2000,
        country: "United States",
        image: "https://mi-imagen.jpg"
    }
    const res = await request(app)
        .post('/artists')
        .send(artist);
    artistId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
});

test('GET /artists', async () => {
    const res = await request(app).get('/artists');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].genres).toBeDefined();
});

test('PUT /artists/:id', async () => {
    const updatedArtist = {
        name: "Bruno Mars updated"
    }
    const res = await request(app)
        .put(`/artists/${artistId}`)
        .send(updatedArtist);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedArtist.name);
});

test('POST /artists/:id/genres should set the artist genres', async () => {
    const genre = await Genre.create({ name: "pop" })
    const res = await request(app)
        .post(`/artists/${artistId}/genres`)
        .send([genre.id])
    await genre.destroy();
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});

test('DELETE /artists/:id', async () => {
    const res = await request(app).delete(`/artists/${artistId}`)
    expect(res.status).toBe(204);
});
