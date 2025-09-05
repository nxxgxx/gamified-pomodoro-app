import request from "supertest";
import app from "../index.js";

describe("GET /inventory", () => {
  it("should return inventory for the test user", async () => {
    const loginRes = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "testpassword",
    });

    expect(loginRes.statusCode).toBe(200);
    const cookie = loginRes.headers["set-cookie"]?.[0];
    expect(cookie).toBeDefined(); //

    const res = await request(app)
      .get("/inventory")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].pokemon).toHaveProperty("name", "Bulbasaur");
  });
});
