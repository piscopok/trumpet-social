import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
