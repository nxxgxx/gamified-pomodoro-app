import request from "supertest";
import app from "../index.js";

describe("POST /capture", () => {
  it("should allow a logged-in user to capture a Pokémon", async () => {
    const loginRes = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "testpassword",
    });

    expect(loginRes.statusCode).toBe(200);
    const cookie = loginRes.headers["set-cookie"]?.[0];
    expect(cookie).toBeDefined();

    const res = await request(app)
      .post("/capture")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("pokemon");
    expect(res.body.pokemon).toHaveProperty("name");
    expect(res.body.pokemon).toHaveProperty("rarity");
  });

  it("should reject if user is not authenticated", async () => {
    const res = await request(app).post("/capture");
    expect(res.statusCode).toBe(401);
  });
});
