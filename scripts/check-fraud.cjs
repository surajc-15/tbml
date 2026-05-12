#!/usr/bin/env node
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL environment variable. Set it before running this script.");
  process.exit(2);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const fraudCount = await prisma.aml_audit_log.count({
      where: { verdict: { equals: "FRAUD", mode: "insensitive" } },
    });

    console.log(`Found ${fraudCount} transaction(s) with verdict FRAUD.`);

    if (fraudCount > 0) {
      const examples = await prisma.aml_audit_log.findMany({
        where: { verdict: { equals: "FRAUD", mode: "insensitive" } },
        take: 20,
        orderBy: { loggedAt: "desc" },
        select: { transactionId: true, senderAccount: true, receiverAccount: true, amount: true, loggedAt: true },
      });

      console.log("Examples:");
      for (const e of examples) {
        console.log(`- ${e.transactionId} | ${e.senderAccount ?? "-"} -> ${e.receiverAccount ?? "-"} | ${e.amount} | ${e.loggedAt}`);
      }
    } else {
      console.log("No FRAUD verdict transactions found.");
    }
  } catch (err) {
    console.error("Error checking fraud transactions:", err);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

main();
