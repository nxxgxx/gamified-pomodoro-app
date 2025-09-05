import request from "supertest";
import app from "../index.js";

describe("auth placeholder", () => {
  it("should run a dummy test", () => {
    expect(true).toBe(true);
  });

  it("should register and log in a new user", async () => {
    const email = "misty@example.com";
    const password = "mistypassword";
    const username = "misty";

    const registerRes = await request(app).post("/register").send({ email, password, username });
    expect(registerRes.statusCode).toBe(200);
    expect(registerRes.body).toHaveProperty("user_id");

    const loginRes = await request(app).post("/login").send({ email, password });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("email", email);
  });
});
