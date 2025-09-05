import request from "supertest";
import app from "../index.js";

describe("POST /logout", () => {
  it("should clear cookie and log out the user", async () => {
    const loginRes = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "testpassword",
    });

    const cookie = loginRes.headers["set-cookie"][0];

    const res = await request(app)
      .post("/logout")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });
});
