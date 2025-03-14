import { PrismaClient } from "@prisma/client";

// /C:/Users/SouravArora/Downloads/Project/my-turborepo/packages/db/src/index.ts

const prisma = new PrismaClient();

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    console.log("Disconnected from the database successfully.");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
    throw error;
  }
}

export default prisma;
