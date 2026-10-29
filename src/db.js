
import sql from "mssql";
import "dotenv/config";

const config = {
  server: process.env.DB_SERVER || "1.7.39.250",
  port: Number(process.env.DB_PORT) || "",
  database: process.env.DB_NAME || "CFS",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "P@$$m0rb",
  options: {
    encrypt: process.env.DB_ENCRYPT === "false",
    trustServerCertificate:
      process.env.DB_TRUST_CERT === "false"
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 10000,
  requestTimeout: 30000
};

export const poolPromise = new sql.ConnectionPool(config).connect();

export { sql };
