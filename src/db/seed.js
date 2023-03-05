import knex from "knex"
import config from "../config.js"
import hashPassword from "../hashPassword.js"

const db = knex(config.db)

const [passwordHash, passwordSalt] = hashPassword("AjaxLeGrand_78")
await db("users").insert([
  {
    firstName: "Sophocle",
    lastName: "Antigone",
    email: "Anti@gmail.com",
    roleId: 1,
    passwordHash: passwordHash,
    passwordSalt: passwordSalt,
  },
])
db.destroy()
