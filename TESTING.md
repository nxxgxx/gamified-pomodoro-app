# This is our Backend Testing Guide

Pokedoro uses Jest and Supertest to test the Node.js/Express API

---

## Test File Structure

All test files are located in the api/tests/ folder and mirror the routes or modules they test:

- `auth.test.js` — Placeholder for testing authentication flow

- `login.test.js` — Tests the /login endpoint

- `me.test.js` — Tests the /me protected endpoint

- `inventory.test.js` — Tests getting the logged-in user’s Pokémon

- `evolution.test.js` — Tests evolving Pokémon in inventory

- `capture.test.js` — Tests capturing a random Pokémon

- `logout.test.js` — Tests the logout route

- `edgecases.test.js` — Covers edge cases like bad logins or invalid deletions

- `ping.test.js` — Tests the /ping health check route

- `test.seed.js` — Handles creating predictable, linked data for tests (such as evolutions)

--- 

## How to Run Tests

Make sure you're in the `api/` directory, then run:

```bash
npm test
```

Or run an individual test:

```bash
npx jest tests/ping.test.js
```

---

## The Set Up

Here are some resources I used:
- [JS Testing Framework - Jest](https://jestjs.io/docs/getting-started)
- [GitHub HTTP testing](https://github.com/ladjs/supertest)


### 1. **Dependencies Installed**

Installed:
```bash
npm install --save-dev jest supertest
```
- `jest` - test runner
- `supertest` - to make HTTP requests to your Express app

---

### 2. **Jest Config**

#### `package.json`
```json
 "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage",
    "seed": "npx prisma db seed"
  },
```

#### `jest.config.js`
```js
export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  maxWorkers: 1,
  testTimeout: 10000
};
```

---

### 3. **Test Setup File**

#### `api/tests/setup.js`
```js
import { PrismaClient } from "@prisma/client";
import { seedTestData } from "./test.seed.js";

const prisma = new PrismaClient();

export async function resetDatabase() {
  await prisma.inventory.deleteMany();
  await prisma.timer.deleteMany();
  await prisma.pokemon.deleteMany();
  await prisma.user.deleteMany();
  await seedTestData();
}

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

---

### 4. **Server Listener Moved**

To prevent the server from running during test runs:

#### `index.js` ends with:
```js
export default app;
```

#### `server.js`:
```js
import app from "./index.js";
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 5. **Seed File**

We are using a seed file (test.seed.js) to add consistent data before each test run. The seed:

 - Adds a test user (ash@example.com / testpassword)

 - Inserts evolvable Pokémon (Bulbasaur → Ivysaur)

 - Adds Pokémon to the user's inventory

This is triggered before every test by setup.js.

---

## 6. **Coverage Reports**

- `npm test` or `npm test -- --coverage`

- install `npx serve` 
	- run `npx serve coverage/lcov-report`
	- clipboard will copy the localhost address, and just paste it into a web browser.
```bash
➜  api git:(feat/Nat-db) ✗ npx serve coverage/lcov-report


   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3000      │
   │   - Network:  http://192.168.4.46:3000   │
   │                                          │
   │   Copied local address to clipboard!     │
   │                                          │
   └──────────────────────────────────────────┘

 HTTP  4/6/2025 11:52:47 AM ::1 GET /
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 23 ms
 HTTP  4/6/2025 11:52:47 AM ::1 GET /prettify.css
 HTTP  4/6/2025 11:52:47 AM ::1 GET /base.css
 HTTP  4/6/2025 11:52:47 AM ::1 GET /prettify.js
 HTTP  4/6/2025 11:52:47 AM ::1 GET /sorter.js
 HTTP  4/6/2025 11:52:47 AM ::1 GET /block-navigation.js
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 6 ms
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 9 ms
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 5 ms
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 3 ms
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 4 ms
 HTTP  4/6/2025 11:52:47 AM ::1 GET /sort-arrow-sprite.png
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 1 ms
 HTTP  4/6/2025 11:52:47 AM ::1 GET /favicon.png
 HTTP  4/6/2025 11:52:47 AM ::1 Returned 200 in 0 ms
^C
 INFO  Gracefully shutting down. Please wait...
```

- You will see an HTML page and this is a simple breakdown of what you will see:

| Column     | Meaning                                                                 |
|------------|-------------------------------------------------------------------------|
| `% Stmts`  | Percent of JavaScript statements executed during tests (e.g. `let x = 1`) |
| `% Branch` | Percent of conditional paths covered (`if`, `else`, ternaries, etc.)    |
| `% Funcs`  | Percent of functions that were called                                   |
| `% Lines`  | Line-by-line execution coverage                                         |
                               
---

## For When We Go Live...

1. **No need to change index.js** — export can stay the way it is
2. `server.js` already runs server in production
3. DO NOT deploy `tests/` folder
4. reseed DB with `npm run seed`
5. exclude tests in Docker or `.gitignore`

```gitignore
/api/tests/
/jest.config.js
```

---

## What This Does for Us
We are now fully set up to:
- Write integration tests
- Reset the database before each test
- Run tests in isolation
- Keep the test server separate from live mode


