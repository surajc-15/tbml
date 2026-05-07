import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  console.log("Seeding Flagged Transactions...");

  // Seed Flagged Transactions
  const transactions = [
    {
      transaction_id: "TXN-771034",
      sender_id: "ACC-90421",
      receiver_id: "ACC-12345",
      amount: 1284500,
      reasons_for_flagging: JSON.stringify(["Invoice mismatch", "Round-dollar layering", "Shell intermediary"]),
      confidence_score: 96.5,
    },
    {
      transaction_id: "TXN-771281",
      sender_id: "ACC-55190",
      receiver_id: "ACC-67890",
      amount: 845000,
      reasons_for_flagging: JSON.stringify(["Rapid pass-through", "High-risk corridor"]),
      confidence_score: 91.2,
    },
    {
      transaction_id: "TXN-771416",
      sender_id: "ACC-33489",
      receiver_id: "ACC-11111",
      amount: 2195000,
      reasons_for_flagging: JSON.stringify(["Beneficial owner discrepancy", "Back-dated documentation"]),
      confidence_score: 94.8,
    },
    {
      transaction_id: "STX-202601",
      sender_id: "ACC-99999",
      receiver_id: "ACC-88888",
      amount: 275000,
      reasons_for_flagging: JSON.stringify(["Unusual unit pricing and urgent settlement request"]),
      confidence_score: 82.1,
    },
  ];

  for (const txn of transactions) {
    await prisma.flaggedTransaction.upsert({
      where: { transaction_id: txn.transaction_id },
      update: {},
      create: txn,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
