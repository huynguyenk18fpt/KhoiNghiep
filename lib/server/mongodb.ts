import { MongoClient, type Collection, type Db, type Document } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "floaty";

declare global {
  // eslint-disable-next-line no-var
  var __floatyMongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  console.warn("MONGODB_URI is not configured. MongoDB API routes will fail until it is set.");
}

function getClientPromise() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment.");
  }

  if (!global.__floatyMongoClientPromise) {
    const client = new MongoClient(uri);
    global.__floatyMongoClientPromise = client.connect();
  }

  return global.__floatyMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
