import { resolve } from "node:path"

const config = {
  port: 3001,
  db: {
    client: "pg",
    connection: {
      user: "avetisk",
      database: "user_management",
    },
    migrations: {
      directory: resolve("./src/db/migrations"),
      stub: resolve("./src/db/migration.stub"),
    },
  },
  security: {
    session: {
      password: {
        saltlen: 32,
        iterations: 123943,
        keylen: 256,
        digest: "sha512",
      },
    },
  },
}

export default config
