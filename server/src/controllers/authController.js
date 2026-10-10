const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");
const { validateRegister, validateLogin } = require("../middleware/validators");

async function register(req, res) {
  const check = validateRegister(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { name, email, password, role, phone, location, categoryId, bio, priceRange } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userRole = role === "ENTREPRENEUR" ? "ENTREPRENEUR" : "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: userRole,
        phone: phone?.trim() || null,
        location: location?.trim() || null,
      },
    });

    if (userRole === "ENTREPRENEUR") {
      await prisma.entrepreneur.create({
        data: {
          userId: user.id,
          categoryId,
          bio: bio?.trim() || null,
          location: location?.trim() || null,
          priceRange: priceRange?.trim() || null,
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

async function login(req, res) {
  const check = validateLogin(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    // Use a constant-time comparison even on "not found" to prevent timing attacks
    const dummyHash = "$2a$12$invalidhashfortimingprotection00000000000000000000000000";
    const valid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, dummyHash);

    if (!user || !valid) {
      return res.status(401).json({ error: "Incorrect email or password." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
}

async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, location: true },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json(user);
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ error: "Could not fetch user details." });
  }
}

module.exports = { register, login, me };
