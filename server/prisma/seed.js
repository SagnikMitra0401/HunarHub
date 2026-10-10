const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Cobbler" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Potter (Kumhar)" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Tailor" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Artisan" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Small Vendor" },
];

async function main() {
  console.log("Seeding categories...");
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const defaultPasswordHash = await bcrypt.hash("Password123!", 12);

  // 1. Seed Admin
  console.log("Seeding Admin account...");
  await prisma.user.upsert({
    where: { email: "admin@hunarhub.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@hunarhub.com",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      phone: "+91 9876543210",
      location: "Central Platform HQ",
    },
  });

  // 2. Seed Micro-Entrepreneurs
  console.log("Seeding Micro-Entrepreneurs & Profiles...");
  const entrepreneursData = [
    {
      user: { name: "Ramesh Kumar Kumhar", email: "ramesh.pottery@gmail.com", phone: "+91 9810123456", location: "Khurja, Uttar Pradesh" },
      categoryName: "Potter (Kumhar)",
      bio: "Third-generation potter specializing in terracotta kitchenware, hand-painted vases, and eco-friendly diyas.",
      priceRange: "₹150 - ₹1,500",
      isVerified: true,
    },
    {
      user: { name: "Sunita Devi", email: "sunita.tailoring@yahoo.com", phone: "+91 9820234567", location: "Jaipur, Rajasthan" },
      categoryName: "Tailor",
      bio: "Expert in traditional Rajasthani embroidery, saree alteration, custom kurti tailoring, and wedding outfits.",
      priceRange: "₹300 - ₹3,000",
      isVerified: true,
    },
    {
      user: { name: "Mohammad Iqbal", email: "iqbal.leathercraft@gmail.com", phone: "+91 9830345678", location: "Agra, Uttar Pradesh" },
      categoryName: "Cobbler",
      bio: "Master cobbler with 20 years experience crafting genuine leather mojaris, boots, and shoe repairs.",
      priceRange: "₹200 - ₹2,500",
      isVerified: true,
    },
    {
      user: { name: "Lakshmi Narayan", email: "lakshmi.carvings@gmail.com", phone: "+91 9840456789", location: "Varanasi, Uttar Pradesh" },
      categoryName: "Artisan",
      bio: "Hand-carved wooden decorative artifacts, brass inlay boxes, and traditional wooden crafts.",
      priceRange: "₹400 - ₹4,500",
      isVerified: false,
    },
    {
      user: { name: "Rajesh Sharma", email: "rajesh.spices@gmail.com", phone: "+91 9850567890", location: "Chandni Chowk, Old Delhi" },
      categoryName: "Small Vendor",
      bio: "Authentic stone-ground Indian spices, homemade pickles, and herbal tea blends.",
      priceRange: "₹100 - ₹800",
      isVerified: false,
    },
  ];

  for (const item of entrepreneursData) {
    let user = await prisma.user.findUnique({ where: { email: item.user.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: item.user.name,
          email: item.user.email,
          passwordHash: defaultPasswordHash,
          role: "ENTREPRENEUR",
          phone: item.user.phone,
          location: item.user.location,
        },
      });
    }

    const category = await prisma.category.findUnique({ where: { name: item.categoryName } });

    const existingEnt = await prisma.entrepreneur.findUnique({ where: { userId: user.id } });
    if (!existingEnt && category) {
      await prisma.entrepreneur.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          bio: item.bio,
          location: item.user.location,
          priceRange: item.priceRange,
          isVerified: item.isVerified,
          isAvailable: true,
        },
      });
    }
  }

  // 3. Seed Customers
  console.log("Seeding Customers...");
  const customersData = [
    { name: "Ananya Roy", email: "ananya.roy92@gmail.com", phone: "+91 9710112233", location: "Kolkata, West Bengal" },
    { name: "Vikram Malhotra", email: "vikram.malhotra@outlook.com", phone: "+91 9720223344", location: "New Delhi" },
    { name: "Priya Nair", email: "priya.nair@gmail.com", phone: "+91 9730334455", location: "Bengaluru, Karnataka" },
  ];

  for (const c of customersData) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        passwordHash: defaultPasswordHash,
        role: "CUSTOMER",
        phone: c.phone,
        location: c.location,
      },
    });
  }

  console.log("Database seeding completed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
