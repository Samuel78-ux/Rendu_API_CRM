import knex from "knex"
import config from "../config.js"
import hashPassword from "../hashPassword.js"

const db = knex(config.db)

const [passwordHash, passwordSalt] = hashPassword("samuelcamara78")
await db("users").insert([
  {
    firstName: "Samuel",
    lastName: "Camara",
    email: "samu@gmail.com",
    roleId: 1,
    passwordHash: passwordHash,
    passwordSalt: passwordSalt,
  },
])
