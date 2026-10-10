const assert = require("assert");
const {
  isValidUUID,
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateServiceRequest,
} = require("../src/middleware/validators");
const { requireAuth, requireRole } = require("../src/middleware/auth");
const jwt = require("jsonwebtoken");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${name}:`, err.message);
    failed++;
  }
}

console.log("==========================================");
console.log(" Running Security & Validation Test Suite");
console.log("==========================================");

// 1. UUID Validation
test("isValidUUID correctly identifies valid and invalid UUIDs", () => {
  assert.strictEqual(isValidUUID("123e4567-e89b-12d3-a456-426614174000"), true);
  assert.strictEqual(isValidUUID("invalid-uuid"), false);
  assert.strictEqual(isValidUUID("123e4567e89b12d3a456426614174000"), false);
});

// 2. Registration Validation
test("validateRegister enforces name, email, password strength, and entrepreneur category", () => {
  assert.strictEqual(validateRegister({ name: "A", email: "test@test.com", password: "password123" }).ok, false);
  assert.strictEqual(validateRegister({ name: "John", email: "invalid-email", password: "password123" }).ok, false);
  assert.strictEqual(validateRegister({ name: "John", email: "john@test.com", password: "short" }).ok, false);
  assert.strictEqual(validateRegister({ name: "John", email: "john@test.com", password: "password123", role: "ENTREPRENEUR" }).ok, false);
  assert.strictEqual(validateRegister({ name: "John", email: "john@test.com", password: "password123", role: "ENTREPRENEUR", categoryId: "cat-123" }).ok, true);
  assert.strictEqual(validateRegister({ name: "Jane", email: "jane@test.com", password: "password123", role: "CUSTOMER" }).ok, true);
});

// 3. Login Validation
test("validateLogin enforces email format and non-empty password", () => {
  assert.strictEqual(validateLogin({ email: "invalid", password: "pass" }).ok, false);
  assert.strictEqual(validateLogin({ email: "user@test.com", password: "" }).ok, false);
  assert.strictEqual(validateLogin({ email: "user@test.com", password: "validpassword" }).ok, true);
});

// 4. Product Validation
test("validateProduct requires non-empty name and positive price", () => {
  assert.strictEqual(validateProduct({ name: "", price: 100 }).ok, false);
  assert.strictEqual(validateProduct({ name: "Handmade Pot", price: -50 }).ok, false);
  assert.strictEqual(validateProduct({ name: "Handmade Pot", price: "abc" }).ok, false);
  assert.strictEqual(validateProduct({ name: "Handmade Pot", price: 250 }).ok, true);
  assert.strictEqual(validateProduct({ name: "Handmade Pot", price: "250.50" }).ok, true);
});

// 5. Order Validation
test("validateOrder enforces valid UUID productId and positive integer quantity", () => {
  assert.strictEqual(validateOrder({ productId: "invalid-id", quantity: 1 }).ok, false);
  assert.strictEqual(validateOrder({ productId: "123e4567-e89b-12d3-a456-426614174000", quantity: 0 }).ok, false);
  assert.strictEqual(validateOrder({ productId: "123e4567-e89b-12d3-a456-426614174000", quantity: 1.5 }).ok, false);
  assert.strictEqual(validateOrder({ productId: "123e4567-e89b-12d3-a456-426614174000", quantity: 2 }).ok, true);
});

// 6. Review Validation
test("validateReview enforces valid UUID entrepreneurId and rating between 1 and 5", () => {
  assert.strictEqual(validateReview({ entrepreneurId: "invalid", rating: 5 }).ok, false);
  assert.strictEqual(validateReview({ entrepreneurId: "123e4567-e89b-12d3-a456-426614174000", rating: 0 }).ok, false);
  assert.strictEqual(validateReview({ entrepreneurId: "123e4567-e89b-12d3-a456-426614174000", rating: 6 }).ok, false);
  assert.strictEqual(validateReview({ entrepreneurId: "123e4567-e89b-12d3-a456-426614174000", rating: 4 }).ok, true);
});

// 7. Service Request Validation
test("validateServiceRequest enforces valid UUID entrepreneurId and description length", () => {
  assert.strictEqual(validateServiceRequest({ entrepreneurId: "invalid", description: "Fix shoes" }).ok, false);
  assert.strictEqual(validateServiceRequest({ entrepreneurId: "123e4567-e89b-12d3-a456-426614174000", description: "hi" }).ok, false);
  assert.strictEqual(validateServiceRequest({ entrepreneurId: "123e4567-e89b-12d3-a456-426614174000", description: "Need leather shoes resoled" }).ok, true);
});

// 8. Auth Middleware - Token Verification
test("requireAuth rejects missing or malformed headers", () => {
  let resStatus = null;
  let resJson = null;

  const mockRes = {
    status(code) { resStatus = code; return this; },
    json(data) { resJson = data; return this; },
  };

  requireAuth({ headers: {} }, mockRes, () => {});
  assert.strictEqual(resStatus, 401);
  assert.strictEqual(resJson.error, "Authentication required.");

  resStatus = null;
  requireAuth({ headers: { authorization: "Basic 123" } }, mockRes, () => {});
  assert.strictEqual(resStatus, 401);
});

// 9. Auth Middleware - Role Verification
test("requireRole enforces role authorization", () => {
  let resStatus = null;
  const mockRes = {
    status(code) { resStatus = code; return this; },
    json() { return this; },
  };

  const adminGuard = requireRole("ADMIN");
  let nextCalled = false;

  adminGuard({ user: { role: "CUSTOMER" } }, mockRes, () => { nextCalled = true; });
  assert.strictEqual(resStatus, 403);
  assert.strictEqual(nextCalled, false);

  resStatus = null;
  adminGuard({ user: { role: "ADMIN" } }, mockRes, () => { nextCalled = true; });
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, true);
});

console.log("==========================================");
console.log(` Results: ${passed} passed, ${failed} failed`);
console.log("==========================================");

if (failed > 0) process.exit(1);
