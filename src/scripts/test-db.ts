import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexão bem-sucedida:", res.rows[0]);
  } catch (err) {
    console.error("❌ Erro na conexão:", err);
  } finally {
    await pool.end();
  }
}

main();
