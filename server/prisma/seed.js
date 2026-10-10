const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  "Cobbler",
  "Potter (Kumhar)",
  "Tailor",
  "Artisan",
  "Small Vendor",
];

async function main() {
  // 1. Seed Categories
  for (const name of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Categories seeded.");

  // 2. Seed Default Admin Account
  const adminEmail = "admin@hunarhub.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("AdminPassword123!", 12);
    await prisma.user.create({
      data: {
        name: "Platform Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        phone: "+91 9876543210",
        location: "Central Platform HQ",
      },
    });
    console.log("Default admin account created: admin@hunarhub.com");
  } else {
    console.log("Admin account already exists.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
