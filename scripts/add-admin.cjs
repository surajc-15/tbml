const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv/config");
const { pbkdf2Sync, randomBytes } = require("crypto");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing from environment variables.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const email = "surajcdev@gmail.com";
    const username = "admin";
    const password = "admin@1234";

    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        username,
        passwordHash: hashPassword(password),
        name: "System Admin",
        bankName: "TBML Admin",
        role: "ADMIN",
      },
      create: {
        email,
        username,
        name: "System Admin",
        passwordHash: hashPassword(password),
        bankName: "TBML Admin",
        role: "ADMIN",
      },
    });

    console.log(`Admin user ready: ${admin.username} <${admin.email}>`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});