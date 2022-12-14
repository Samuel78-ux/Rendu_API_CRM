import cors from "cors"
import express from "express"
import DB from "./db.js"
import makeRoutesUsers from "./routes/makeRoutesUsers.js"

const run = async (config) => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  const db = new DB(config.db)

  await db.connect()

  makeRoutesUsers({ app, db })

  // eslint-disable-next-line no-console
  app.listen(config.port, () => console.log(`Listening on :${config.port}`))
}

export default run
