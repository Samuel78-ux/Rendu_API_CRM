const makeRoutesUsers = ({ app, db }) => {
  app.post("/users", async (req, res) => {
    const record = await db.create("users", req.body)

    res.send({ result: record })
  })
  app.get("/users", async (req, res) => {
    res.send({ result: await db.read("users") })
  })
  app.get("/users/:userId", async (req, res) => {
    res.send({ result: await db.read("users", req.params.userId) })
  })
  app.patch("/users/:userId", async (req, res) => {
    const record = await db.update("users", {
      ...req.body,
      id: req.params.id,
    })

    res.send({ result: record })
  })
  app.delete("/users/:userId", async (req, res) => {
    res.send({ result: await db.delete("users", req.params.userId) })
  })
}

export default makeRoutesUsers
