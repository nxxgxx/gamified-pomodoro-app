import request from "supertest";
import app from "../index.js";

describe("POST /evolve/:inventoryId", () => {
  it("should evolve a Pokémon if eligible", async () => {
    const loginRes = await request(app).post("/login").send({
      email: "ash@example.com",
      password: "testpassword"
    });

    expect(loginRes.statusCode).toBe(200);
    const cookie = loginRes.headers["set-cookie"]?.[0];
    expect(cookie).toBeDefined();

    const inventoryRes = await request(app)
      .get("/inventory")
      .set("Cookie", cookie);

    const evolvable = inventoryRes.body.find(
      (item) => item.pokemon?.next_evolution_id !== null
    );

    expect(evolvable).toBeDefined();

    const evolveRes = await request(app)
      .post(`/evolve/${evolvable.inventory_id}`)
      .set("Cookie", cookie);

    // console.log("evolveRes.body:", evolveRes.body);

    expect(evolveRes.statusCode).toBe(200);
    expect(evolveRes.body.evolved.pokemon_id).toBe(
      evolvable.pokemon.next_evolution_id
    );
  });
});
