# Pokedoro

We are here to gamify the Pomodoro study method with Pokemon!

The objectives of this portion:
### Server Side

- Build our table
- Implement basic endpoints (ping, GET, POST)
- Implement login, registration authentication using requireAuth middleware (provided by class material)

### Client Side

- Register Page
- Login Page
- Functionality: Display all items with GET, Add item with POST

Currently, a User may register an account, login, logout, and add Pokemon using the "Capture Pokemon" button in the bottom right widget. Pokemon in your inventory will display in the left Widget in bullet format.

Other features such as the timer and music buttons, and the profile and Pokemon links in the banner, are not currently implemented.

A video of the client in action may be found on [Google Drive](https://drive.google.com/file/d/1pW6FO0hkQFChpLC9T9oBdP6SX6JuddgZ/view?usp=drive_link)

---
# Full Setup Guide

## Backend Setup and Database Seeding

### 1. Make sure you are in the correct directory

	- `cd api`

---

### 2. Make sure the .env file is in the api/ directory, it should look like this:

```javascript
DATABASE_URL="mysql://root:123456@localhost:3306/pokedoro"
JWT_SECRET=very_long_secret
JWT_REFRESH_SECRET=very_long_secret_for_refresh
```

### Make sure the .env file is in the client/ directory, it should look like this:
```javascript
REACT_APP_API_URL=http://localhost:8000
```
---

### 3. Prisma requires node.js so make sure that you are using the latest and compatible version
	- `nvm use 20`
	- if you need to install Node 20:
		- `nvm install 20`
		- `nvm use 20`
		- `node -v` <-- this is to verify you are using the correct version
	- `npm install` <-- dependencies

---

### 4. In terminal, start MySQL
	- `mysql -u root -p`
	- password: `123456` + `enter`
	- `SHOW DATABASES;`
(Use your own password if it does not match ours above.)
```sql
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| pokedoro           |
| sys                |
| tododb             |
+--------------------+
6 rows in set (0.01 sec)
```
		- if "pokedoro" is not listed we must create it
		- `CREATE DATABASE pokedoro;`
	- `USE pokedoro;`

`Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A`

	- `SHOW TABLES;`
```sql
+--------------------+
| Tables_in_pokedoro |
+--------------------+
| _prisma_migrations |
| Inventory          |
| Pokemon            |
| Timer              |
| User               |
+--------------------+
5 rows in set (0.01 sec)
```

	- `DESCRIBE Pokemon;`
```sql
+-------------------+---------------------------------------------+------+-----+---------+----------------+
| Field             | Type                                        | Null | Key | Default | Extra          |
+-------------------+---------------------------------------------+------+-----+---------+----------------+
| pokemon_id        | int                                         | NO   | PRI | NULL    | auto_increment |
| pokedex_id        | int                                         | NO   |     | NULL    |                |
| name              | varchar(191)                                | NO   | UNI | NULL    |                |
| nickname          | varchar(191)                                | NO   |     | NULL    |                |
| rarity            | enum('COMMON','UNCOMMON','RARE','MYTHICAL') | NO   |     | NULL    |                |
| image_url         | varchar(191)                                | NO   |     | NULL    |                |
| next_evolution_id | int                                         | YES  | MUL | NULL    |                |
| evolve_level      | int                                         | YES  |     | NULL    |                |
+-------------------+---------------------------------------------+------+-----+---------+----------------+
```

	- `exit`

---


### 5. Run the seed script to populate the database

- Make sure you are in the api/ directory
	- `cd api`

- Apply the Prisma Schema and seed the database
	- `npx prisma migrate reset`
	- say `y` to the prompt and hit `enter`, you should then see

```terminal
➜  api git:(feat/nat-algo-to-seed) npx prisma migrate reset
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "pokedoro" at "localhost:3306"

✔ Are you sure you want to reset your database? All data will be lost. … yes

Applying migration `20250331203926_init`

Database reset successful

The following migration(s) have been applied:

migrations/
  └─ 20250331203926_init/
    └─ migration.sql

Running generate... - Prisma Client
✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 49ms

Running seed command `node seed.cjs` ...
Fetching Pokémon from PokéAPI...
Fetched #1 - bulbasaur
Fetched #2 - ivysaur
.
.
.
Fetched #150 - mewtwo
Fetched #151 - mew
Total Pokémon ready to insert: 151
Inserting Pokémon into the database...
Seeded Gen 1 Pokémon successfully!

🌱  The seed command has been executed.

➜  api git:(feat/nat-algo-to-seed) 
```
---

### Verifying the Database Connection & Seeding:

We just ran through the process of making sure we are connected, we have a clean database, and a seeded database. Below are a few ways to confirm that the database is indeed connected properly with visual confirmation:

* Steps 1-5 will connect to MySQL,  drop the current "pokedoro" database and tables, and recreate the schema based on our `schema.prisma` file.

* We can also view the database in a browser, in terminal run the command `npx prisma studio` which will open a window at "http://localhost:5555/". Here you can click on the Pokemon table in the left sidebar to view. When you are ready to close the connection, simply type `CLTR + C` in terminal.

* We can also view the database and tables by logging back into MySQL (once completing steps 1-5):
	- confirm: `cd api`
	- `mysql -u root -p`
	- password: `123456` + `enter`

- myql> `USE Pokedoro;`

- mysql> `SELECT COUNT(*) FROM Pokemon;` 
```sql
+----------+
| COUNT(*) |
+----------+
|      151 |
+----------+
1 row in set (0.01 sec)
```
- mysql> `SELECT pokemon_id, name, rarity FROM Pokemon LIMIT 10;`
```sql
+------------+------------+--------+
| pokemon_id | name       | rarity |
+------------+------------+--------+
|          1 | bulbasaur  | RARE   |
|          2 | ivysaur    | RARE   |
|          3 | venusaur   | RARE   |
|          4 | charmander | RARE   |
|          5 | charmeleon | RARE   |
|          6 | charizard  | RARE   |
|          7 | squirtle   | RARE   |
|          8 | wartortle  | RARE   |
|          9 | blastoise  | RARE   |
|         10 | caterpie   | COMMON |
+------------+------------+--------+
10 rows in set (0.00 sec)
```

- mysql> `exit`

## Server Setup

Ensure you are in the api folder.
We recommend starting the server using nodemon

```bash
cd api
npx nodemon index.js
```

outputs

```bash
[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
Server running on http://localhost:8000 🎉 🚀
```


## .env file

Ensure your have a .env file in your client folder that contains
the following line:

```bash
REACT_APP_API_URL=http://localhost:8000
```

Update your dependencies

```bash
cd client
npm install
```

And run the file

```bash
npm start
```
