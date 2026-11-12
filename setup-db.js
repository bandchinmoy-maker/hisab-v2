import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        amount NUMERIC NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        person TEXT,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database table 'transactions' successfully ban gayi hai!");
  } catch (error) {
    console.error("Table banane mein error aaya:", error);
  }
}

setupDatabase();