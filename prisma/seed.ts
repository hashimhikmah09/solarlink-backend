import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Cleaning up existing database records...");
  
  // ============================================
  // TRANSACT CLEAN-UP (Order matters to avoid foreign key conflicts!)
  // ============================================
  await prisma.$transaction([
    prisma.installation.deleteMany(),
    prisma.review.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.product.deleteMany(),
    prisma.company.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("🌱 Database cleaned. Injecting fresh seed data...");

  // ============================================
  // CREATE USERS
  // ============================================
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@gmail.com`,
        password: "hashedpassword", // Ideal spot for a bcrypt string later
        role: "CUSTOMER",
      },
    });
    users.push(user);
  }

  // ============================================
  // CREATE COMPANIES
  // ============================================
  const companies = [];
  for (let i = 1; i <= 10; i++) {
    const company = await prisma.company.create({
      data: {
        name: `Solar Company ${i}`,
        location: "Lagos",
        description: `Description for Solar Company ${i}`,
        owner: {
          connect: {
            id: users[(i - 1) % users.length]!.id,
          },
        },
      },
    });
    companies.push(company);
  }

  // ============================================
  // CREATE PRODUCTS
  // ============================================
  for (let i = 1; i <= 10; i++) {
    await prisma.product.create({
      data: {
        name: `Solar Panel ${i}`,
        price: 1000 + i * 100,
        description: `High quality solar panel ${i}`,
        companyId: companies[i % companies.length]!.id,
      },
    });
  }

  // ============================================
  // CREATE QUOTES
  // ============================================
  for (let i = 1; i <= 10; i++) {
    await prisma.quote.create({
      data: {
        message: `Quote request ${i}`,
        status: "PENDING",
        userId: users[i % users.length]!.id,
        companyId: companies[i % companies.length]!.id,
      },
    });
  }

  // ============================================
  // CREATE REVIEWS
  // ============================================
  for (let i = 1; i <= 10; i++) {
    await prisma.review.create({
      data: {
        rating: 4,
        comment: `Excellent service ${i}`,
        userId: users[i % users.length]!.id,
        companyId: companies[i % companies.length]!.id,
      },
    });
  }

  // ============================================
  // CREATE INSTALLATIONS
  // ============================================
  for (let i = 1; i <= 10; i++) {
    await prisma.installation.create({
      data: {
        address: `No ${i} Lagos Street`,
        installationDate: new Date(),
        userId: users[i % users.length]!.id,
        companyId: companies[i % companies.length]!.id,
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });