import request from "supertest";
import app from "../index.js";

describe("POST /login", () => {
  it("should log in with valid credentials and return a cookie", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "ash@example.com",
        password: "testpassword", // matches the pre-hashed password in seedTestData
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "ash@example.com");
    expect(res.body).toHaveProperty("username", "ashketchum");
    expect(res.headers["set-cookie"]).toBeDefined(); // token was set
  });

  it("should fail to log in with an invalid password", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "ash@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should fail to log in with a non-existent user", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "notarealuser@example.com",
        password: "somepassword",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });
});
