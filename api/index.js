import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const app = express();
app.use(cors({ origin: "https://final-project-part-2-catsandcomputers-9sn3.vercel.app", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.set("trust proxy", true);

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const DEFAULT_TOKEN_DURATION = "1d"
const DEFAULT_COOKIE_DURATION = 1 * 24 * 60 * 60 * 1000 // days * hrs * min * sec * ms

// Middleware to verify JWT token sent by the client. This code provided by professor in class materials
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  console.log("🧪 Auth middleware token:", token); // error handling
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // attaching the user id to the request object, this will make it available in the endpoints that use this middleware
    req.user_id = payload.user_id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/test-cookies", (req, res) => {
  console.log("🍪 Cookies received:", req.cookies);
  res.json({ cookies: req.cookies });
});

app.post("/register", async (req, res) => {
  const { email, password, username, onboard_complete, current_style } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      onboard_complete: onboard_complete ?? false,
      current_style: current_style ?? null,
    },
    select: {
      user_id: true,
      email: true,
      username: true,
      onboard_complete: true,
      current_style: true,
    },
  });

  const payload = { user_id: newUser.user_id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: DEFAULT_TOKEN_DURATION }); 
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: DEFAULT_COOKIE_DURATION,
  });

  res.json(newUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = { user_id: user.user_id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: DEFAULT_TOKEN_DURATION });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: DEFAULT_COOKIE_DURATION,
  });

  // do not send the password to the client
  const userData = {
    id: user.user_id,
    email: user.email,
    username: user.username,
  };

  res.json(userData);
});

app.get('/auth/refresh', requireAuth, async (req, res) => {
  const user_id = req.user_id;

  const payload = { user_id: user_id }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: DEFAULT_TOKEN_DURATION });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: DEFAULT_COOKIE_DURATION,
  });
  res.status(200).json({ refreshed: true });
})

app.post('/auth/clear_cookie', requireAuth, async(req, res) => {
  res.clearCookie("token");
  return res.status(200).json({success: true, message: "Token cleared"});
})

app.get("/inventory", requireAuth, async (req, res) => {
  const user_id = req.user_id;

  try {
    const [user, inventory] = await Promise.all([
        prisma.user.findUnique({
          where: { user_id },
          select: { selected_inventory_id: true },
        }),
        prisma.inventory.findMany({
          where: { user_id },
          include: { pokemon: true },
        }),
      ]);
  
    res.json({selected_inventory_id: user.selected_inventory_id,
      inventory
    });
  } catch (err) {
    console.error("Inventory GET error:", err);
    res.status(500).json({error: "Failed to update the inventory"});
  }
});


app.get("/inventory/selected", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { user_id: req.user_id },
    include: {
      selected_inventory: {
        include: { pokemon: true },
      },
    },
  });

  if (!user || !user.selected_inventory) {
    return res.status(404).json({ error: "No selected Pokémon found." });
  }

  res.json(user.selected_inventory);
});

app.post("/inventory/select/:inventoryId", requireAuth, async (req, res) => {
  const user_id = req.user_id;
  const inventory_id = parseInt(req.params.inventoryId);

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { inventory_id: inventory_id },
      include: { user: true },
    });

    if (!inventory || inventory.user_id !== user_id) {
      return res.status(403).json({ error: "Invalid or unauthorized inventory" });
    }

    await prisma.user.update({
      where: { user_id },
      data: {
        selected_inventory_id: inventory_id,
      },
    });

    res.status(200).json({ message: "Selected successfully" });
  } catch (err) {
    console.error("Failed to select:", err);
    res.status(500).json({ error: "Failed to select inventory" });
  }
});

app.put("/inventory/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user_id = req.user_id;
  const { nickname } = req.body;

  if (!nickname || typeof nickname !== "string") {
    return res.status(400).json({ error: "Invalid or missing nickname." });
  }

  try {
    // Check if inventory item belongs to the user
    const inventory = await prisma.inventory.findUnique({
      where: { inventory_id: id },
    });

    if (!inventory || inventory.user_id !== user_id) {
      return res.status(403).json({ error: "Not authorized to update this Pokémon." });
    }

    // Update nickname
    const updated = await prisma.inventory.update({
      where: { inventory_id: id },
      data: { nickname },
      include: { pokemon: true },
    });

    res.json({ message: "Nickname updated!", inventory: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.delete("/inventory/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user_id = req.user_id;

  try {
    // Check if the item exists and belongs to the user
    const inventory = await prisma.inventory.findUnique({
      where: { inventory_id: id },
    });

    if (!inventory || inventory.user_id !== user_id) {
      return res.status(403).json({ error: "Item not found or not authorized" });
    }

    // Now that we verified ownership, delete it
    const deletedItem = await prisma.inventory.delete({
      where: { inventory_id: id },
    });

    res.json({ message: "Deleted!", item: deletedItem });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { user_id: req.user_id },
    select: { user_id: true, email: true, username: true },
  });
  res.json(user);
});

app.get("/pokemon", requireAuth, async (req, res) => {
  const pokemon = await prisma.pokemon.findMany();
  res.json(pokemon);
});

app.get("/timers", requireAuth, async (req, res) => {
  const user_id = req.user_id;

  try {
    const timers = await prisma.timer.findMany({
      where: { user_id },
      orderBy: { start_time: "desc" }, // Most recent first
    });

    res.status(200).json(timers);
  } catch (err) {
    console.error("Error fetching timers:", err);
    res.status(500).json({ error: "Failed to retrieve timers" });
  }
});

app.post("/capture", requireAuth, async (req, res) => {
  const user_id = req.user_id;
  const val = Math.random();                    // [0, 1]
  
  const rarity =  (val < 0.01) ?  "LEGENDARY" : // 1% legendary
                  (val < 0.1) ?   "RARE" :       // 9% rare
                  (val < 0.4) ?   "UNCOMMON" :  // 30% uncommon
                                  "COMMON";     // 60% common

  const options = await prisma.pokemon.findMany({where: {"rarity": rarity}})

  if (options.length === 0) {
    return res.status(400).send("No pokemon found!")
  }

  const index = Math.floor(Math.random() * options.length) // Gets a random index from the array of options

  const selectedPokemon = options[index];

  const captured = await prisma.inventory.create({
    data: {
      user_id,
      pokemon_id: selectedPokemon.pokemon_id
    },
  });

    res.status(201).json({pokemon: selectedPokemon});
});

app.post("/capture/:pokemonId", requireAuth, async (req, res) => {
  const pokemonId = parseInt(req.params.pokemonId, 10);
  const user_id = req.user_id;

  if (isNaN(pokemonId)){
    return res.status(400).json({error: "Invalid pokemon id provided"});
  }

  const captured = await prisma.pokemon.findUnique({ where: {pokemon_id: pokemonId}})
  if (!captured) {
    return res.status(400).json({ error: "Invalid pokemon id provided" });
  }
    
  try { 
    const added = await prisma.inventory.create({
      data: {
        user_id,
        pokemon_id: captured.pokemon_id 
      },
      include: {
        pokemon: true
      }
    });

    // Check if this is the user has any pokemon selected, if not. Make this pokemon the selected one.
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (!user.selected_inventory_id) {
      await prisma.user.update({
        where: { user_id },
        data: {
          selected_inventory_id: added.inventory_id,
        },
      });
    }

    res.status(201).json({pokemon: added})
  } catch (err) {
    console.error("Capture error:", err);
    return res.status(500).json({ error: "Problem in the pokemon database. Failed to capture" })
  }
})

app.post("/evolve/:inventoryId", requireAuth, async (req, res) => {
  const { inventoryId } = req.params;
  const user_id = req.user_id;

  // Get the inventory entry
  const inventory = await prisma.inventory.findUnique({
    where: { inventory_id: parseInt(inventoryId) },
    include: { pokemon: true },
  });

  if (!inventory || inventory.user_id !== user_id) {
    return res.status(404).json({ error: "Inventory item not found or not yours." });
  }

  const currentPokemon = inventory.pokemon;

  if (!currentPokemon.next_evolution_id) {
    return res.status(400).json({ error: "This Pokémon cannot evolve." });
  }

  const evolvedPokemon = await prisma.pokemon.findUnique({
    where: { pokemon_id: currentPokemon.next_evolution_id },
  });

  if (!evolvedPokemon) {
    return res.status(500).json({ error: "Evolved Pokémon not found in database." });
  }

  // Update inventory with new evolved Pokémon
  const updated = await prisma.inventory.update({
    where: { inventory_id: parseInt(inventoryId) },
    data: {
      pokemon_id: evolvedPokemon.pokemon_id,
    },
    include: { pokemon: true }
  });

  res.status(200).json({ evolved: updated.pokemon });
});

app.post("/timer/complete", requireAuth, async (req, res) => {
  const user_id = req.user_id;
  const { duration } = req.body; // duration in minutes

  // Step 1: Find user's selected Pokémon
  const user = await prisma.user.findUnique({
    where: { user_id },
    include: {
      selected_inventory: {
        include: { pokemon: true },
      },
    },
  });

  const selected = user?.selected_inventory;
  if (!selected) {
    return res.status(404).json({ error: "No selected Pokémon." });
  }

  // Step 2: Add XP from duration to selected inventory entry
  const updated = await prisma.inventory.update({
    where: { inventory_id: selected.inventory_id },
    data: {
      experience: { increment: duration },
    },
    include: {
      pokemon: true,
    },
  });

  // Step 3 (optional): Auto-evolve if XP exceeds requirement
  const requiredXP = updated.pokemon.evolve_level;
  let evolved = null;

  if (requiredXP && updated.experience >= requiredXP && updated.pokemon.next_evolution_id) {
    const evolvedData = await prisma.pokemon.findUnique({
      where: { pokemon_id: updated.pokemon.next_evolution_id },
    });

    evolved = await prisma.inventory.update({
      where: { inventory_id: updated.inventory_id },
      data: {
        pokemon_id: evolvedData.pokemon_id,
      },
      include: {
        pokemon: true,
      },
    });
  }

  res.json({
    message: "XP added!",
    xp: updated.experience,
    evolved: evolved?.pokemon || null,
  });
});

app.post("/timers", requireAuth, async (req, res) => {
  const user_id = req.user_id;
  const { start_time, end_time, duration, completed } = req.body;

  try {
    const timer = await prisma.timer.create({
      data:{
        user_id,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        duration,
        completed
      }
    });
    // Successful post
    res.status(201).json(timer);
  } catch (err) {
    console.error("Error creating timer:", err);
    res.status(500).json({error: "Failed to create timer"});
  }
})

app.post("/onboarding/complete", requireAuth, async (req, res) => {
  const user_id = req.user_id;

  try {
    const updated = await prisma.user.update({
      where: { user_id },
      data: { onboard_complete: true },
    });

    res.status(200).json({ 
      success: true,
      message: "Onboarding marked complete", 
      user: updated 
    });
  } catch (err) {
    console.error("Failed to complete onboarding:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to complete onboarding" 
    });
  }
});

app.post("/onboarding/style", requireAuth, async (req, res) => {
  const user_id = req.user_id;
  const { style } = req.body;

  // Optional: we can validate the input style
  const allowedStyles = ["pixel-dark", "retro-light", "neon", "pastel"];
  if (!style || !allowedStyles.includes(style)) {
    return res.status(400).json({ error: "Invalid or missing style." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { current_style: style },
    });

    res.status(200).json({
      success: true,
      message: "Style updated successfully",
      current_style: updatedUser.current_style,
    });
  } catch (err) {
    console.error("Error updating style:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to update style." 
    });
  }
});

app.get("/onboarding/status", requireAuth, async (req, res) => {
  const user_id = req.user_id;

  try {
    const user = await prisma.user.findUnique({
      where: { user_id },
      select: { onboard_complete: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ onboard_complete: user.onboard_complete });
  } catch (err) {
    console.error("Error checking onboarding status:", err);
    res.status(500).json({ error: "Failed to retrieve onboarding status" });
  }
});


app.get("/app/profile", requireAuth, async(req, res) => {
  const user_id = req.user_id;
  
  try {
    const data = await prisma.user.findUnique({
      where: {user_id},
      select: {
        user_id: true, 
        username: true,
        created_at: true,
        onboard_complete: true,
        current_style: true,
        timers: true,
        inventories: true,
        selected_inventory_id: true,
        selected_inventory: true
      }
    });
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error("Error when trying to get user profile data:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user"
    });
  }

  
})

app.delete("/app/profile", requireAuth, async(req, res) => {
  const user_id = req.user_id;

  try {
    // Delete user's inventory
    const deletedInventories = await prisma.inventory.deleteMany({
      where: {user_id}
    })

    // Delete user's timers
    const deletedTimers = await prisma.timer.deleteMany({
      where: {user_id}
    })

    // Delete user's account
    const deletedUser = await prisma.user.delete({
      where: {user_id}
    })
    
    return res.status(200).json({
      success: true,
      message: `Successfully deleted user.`,
      data: {user_id}
    })

    // Redirect back to home page
  } catch (err) {
    console.error("An error occurred while trying to delete this account:", err);
    return res.status(500).json({
      success: false,
      message: "Could not delete profile. Please try again later",
      error: err.message,
      data: {user_id}
    });
  }
})
// UNCOMMENT THIS TO MAKE THE SERVER RUN NORMALLY! For dev and testing, I am setting up a test server.
if (process.env.NODE_ENV !== "test") {
  const PORT = parseInt(process.env.PORT) || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// this allows my test files to import app from "index.js";
// COMMENT THIS WHEN DONE WITH TESTING.
//export default app;
