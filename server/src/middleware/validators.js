// Lightweight, dependency-free request validation helpers.
// Each function returns { ok: true } or { ok: false, error: "message" }.

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidUUID(str) {
  if (typeof str !== "string") return false;
  return /^[0-9a-z]{1,8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/i.test(str.trim());
}

function isPositiveNumber(val) {
  return typeof val === "number" && isFinite(val) && val > 0;
}

function validateRegister(body) {
  const { name, email, password, role } = body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return { ok: false, error: "Name must be at least 2 characters." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }
  if (!password || password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (role === "ENTREPRENEUR" && !body.categoryId) {
    return { ok: false, error: "Please select a skill category." };
  }
  return { ok: true };
}

function validateLogin(body) {
  const { email, password } = body;
  if (!isValidEmail(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }
  if (!password || password.length < 1) {
    return { ok: false, error: "Password is required." };
  }
  return { ok: true };
}

function validateProduct(body) {
  const { name, price } = body;
  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return { ok: false, error: "Product name is required." };
  }
  const numPrice = Number(price);
  if (!isPositiveNumber(numPrice)) {
    return { ok: false, error: "Price must be a positive number." };
  }
  return { ok: true };
}

function validateOrder(body) {
  const qty = Number(body.quantity);
  if (body.quantity !== undefined && (!Number.isInteger(qty) || qty < 1)) {
    return { ok: false, error: "Quantity must be a whole number of at least 1." };
  }
  if (!body.productId || !isValidUUID(body.productId)) {
    return { ok: false, error: "Invalid product." };
  }
  return { ok: true };
}

function validateReview(body) {
  const { entrepreneurId, rating } = body;
  if (!entrepreneurId || !isValidUUID(entrepreneurId)) {
    return { ok: false, error: "Invalid entrepreneur." };
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return { ok: false, error: "Rating must be a whole number between 1 and 5." };
  }
  return { ok: true };
}

function validateServiceRequest(body) {
  const { entrepreneurId, description } = body;
  if (!entrepreneurId || !isValidUUID(entrepreneurId)) {
    return { ok: false, error: "Invalid entrepreneur." };
  }
  if (!description || typeof description !== "string" || description.trim().length < 5) {
    return { ok: false, error: "Please describe your request in a few words." };
  }
  return { ok: true };
}

module.exports = {
  isValidUUID,
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateServiceRequest,
};
