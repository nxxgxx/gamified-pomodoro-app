// The /me endpoint is a protected route that returns info about the currently authenticated user.
// It relies on the requireAuth middleware to check the JWT stored in cookies.

import request from "supertest";
import app from "../index.js";

describe("GET /me", () => {
  it("should return user info when logged in", async () => {
    const loginRes = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "testpassword",
    });

    // ✅ Sanity check to make sure login worked and cookie is present
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    const cookie = loginRes.headers["set-cookie"][0];

    const res = await request(app).get("/me").set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "ash@example.com");
    expect(res.body).toHaveProperty("username", "ashketchum");
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/me");
    expect(res.statusCode).toBe(401);
  });
});
