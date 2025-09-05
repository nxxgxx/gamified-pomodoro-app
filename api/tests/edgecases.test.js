import request from "supertest";
import app from "../index.js";

describe("Edge Case Tests", () => {
  it("should reject login with bad credentials", async () => {
    const res = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should return empty inventory for new user", async () => {
    await request(app).post("/register").send({
      email: "misty@example.com",
      password: "testpassword",
      username: "misty",
    });

    const loginRes = await request(app).post("/login").send({
      email: "misty@example.com",
      password: "testpassword",
    });

    const cookie = loginRes.headers["set-cookie"][0];

    const res = await request(app)
      .get("/inventory")
      .set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 400 when deleting a non-existent inventory ID", async () => {
    const loginRes = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "testpassword",
    });

    const cookie = loginRes.headers["set-cookie"][0];

    const res = await request(app)
      .delete("/inventory/999999")
      .set("Cookie", cookie);

      expect(res.statusCode).toBe(400); // // this depends how our delete route handles invalid IDs
      expect(res.body).toHaveProperty("error", "Invalid inventory ID or not found.");
  });
});
