import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type ClerkUserPayload = {
  id?: string;
  name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  primary_email_address?: { email_address?: string };
  primaryEmailAddress?: { emailAddress?: string };
  email_addresses?: Array<{ email_address?: string }>;
};

type ClerkWebhookBody = {
  type?: string;
  event?: { type?: string };
  events?: Array<{ type?: string }>;
  data?: ClerkUserPayload | { user?: ClerkUserPayload; object?: ClerkUserPayload };
  user?: ClerkUserPayload;
};

function getPayloadUser(body: ClerkWebhookBody): ClerkUserPayload | undefined {
  if (!body.data) {
    return body.user;
  }

  if ("user" in body.data && body.data.user) {
    return body.data.user;
  }

  if ("object" in body.data && body.data.object) {
    return body.data.object;
  }

  return body.data as ClerkUserPayload;
}

// --------------------------------------------------
// Extract event type
// --------------------------------------------------
function getEventType(body: ClerkWebhookBody): string {
  return (
    body.type ||
    body.event?.type ||
    (Array.isArray(body.events) && body.events[0]?.type) ||
    ""
  );
}

// --------------------------------------------------
// Extract Clerk user ID
// --------------------------------------------------
function getUserId(body: ClerkWebhookBody): string | null {
  const data = body.data as
    | {
        id?: string;
        user_id?: string;
        userId?: string;
        user?: { id?: string };
        object?: { id?: string };
      }
    | undefined;

  return (
    data?.id ||
    data?.user?.id ||
    data?.object?.id ||
    body.user?.id ||
    data?.user_id ||
    data?.userId ||
    null
  );
}

// --------------------------------------------------
// Extract email from webhook payload
// --------------------------------------------------
function getEmail(body: ClerkWebhookBody): string {
  const user = getPayloadUser(body);

  if (!user) return "";

  return (
    user.primary_email_address?.email_address ||
    user.primaryEmailAddress?.emailAddress ||
    user.email ||
    user.email_addresses?.[0]?.email_address ||
    ""
  );
}

function getName(body: ClerkWebhookBody): string {
  const user = getPayloadUser(body);

  if (!user) return "";

  return (
    user.name ||
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    ""
  );
}

// --------------------------------------------------
// Save user to database
// --------------------------------------------------
async function saveUserToDatabase(
  clerkId: string,
  email: string
) {
  const safeEmail = email || `${clerkId}@clerk.local`;

  await prisma.user.upsert({
    where: {
      clerkId,
    },

    update: email ? { email: safeEmail } : {},

    create: {
      clerkId,
      email: safeEmail,
      role: "BANK_USER",
    },
  });
}

// --------------------------------------------------
// Webhook Route
// --------------------------------------------------
export async function POST(req: Request) {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing CLERK_WEBHOOK_SECRET",
        },
        { status: 500 }
      );
    }

    const payload = await req.text();

    const webhook = new Webhook(secret);
    const body = webhook.verify(payload, {
      "svix-id": req.headers.get("svix-id") ?? "",
      "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
      "svix-signature": req.headers.get("svix-signature") ?? "",
    }) as ClerkWebhookBody;

    const eventType = getEventType(body);

    // Ignore unrelated events
    if (
      !eventType.includes("user.created") &&
      !eventType.includes("users.create")
    ) {
      return NextResponse.json({
        ok: true,
        message: "Event ignored",
      });
    }

    const clerkId = getUserId(body);

    if (!clerkId) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing user id",
        },
        { status: 400 }
      );
    }

    const email = getEmail(body);
    const name = getName(body);

    await saveUserToDatabase(clerkId, email);

    // Name is currently not stored in the schema, but we keep the extraction here
    // so it is available once a profile column is added.
    void name;

    return NextResponse.json({
      ok: true,
      message: "User synced successfully",
    });

  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";