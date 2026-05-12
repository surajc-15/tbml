const { PrismaClient } = require("@prisma/client");

const { Pool } = require("pg");

const { PrismaPg } = require("@prisma/adapter-pg");

require("dotenv/config");

const auditData = require("./aml_audit_log_202605121542.json");

async function main() {
  const connectionString =
    process.env.DIRECT_URL ||"postgresql://postgres:ROOT@localhost:5432/tbml";

  if (!connectionString) {
    throw new Error(
      "DIRECT_URL missing in .env"
    );
  }

  const pool = new Pool({
    connectionString,
  });

  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
  });

  try {
    console.log(
      "Starting data insertion..."
    );

    for (const tx of auditData.aml_audit_log) {
      await prisma.aml_audit_log.upsert({
        where: {
          transactionId:
            tx.transaction_id,
        },

        update: {
          senderAccount:
            tx.sender_account,

          receiverAccount:
            tx.receiver_account,

          amount: tx.amount,

          verdict: tx.verdict,

          confidenceScore:
            tx.confidence_score,

          strMetadata:
            typeof tx.str_metadata ===
            "string"
              ? JSON.parse(
                  tx.str_metadata
                )
              : tx.str_metadata,

          actionTaken:
            tx.action_taken,

          loggedAt: new Date(
            tx.logged_at
          ),
        },

        create: {
          transactionId:
            tx.transaction_id,

          senderAccount:
            tx.sender_account,

          receiverAccount:
            tx.receiver_account,

          amount: tx.amount,

          verdict: tx.verdict,

          confidenceScore:
            tx.confidence_score,

          strMetadata:
            typeof tx.str_metadata ===
            "string"
              ? JSON.parse(
                  tx.str_metadata
                )
              : tx.str_metadata,

          actionTaken:
            tx.action_taken,

          loggedAt: new Date(
            tx.logged_at
          ),
        },
      });

      console.log(
        `Inserted: ${tx.transaction_id}`
      );
    }

    console.log(
      "All transactions inserted successfully."
    );
  } catch (error) {
    console.error(
      "Insertion failed:",
      error
    );
  } finally {
    await prisma.$disconnect();

    await pool.end();
  }
}

main();