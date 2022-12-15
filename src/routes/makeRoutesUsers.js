import { NotFoundError } from "../errors.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { emailValidator, idValdiator, nameValidator } from "../validators.js"

const makeRoutesUsers = ({ app, db }) => {
  const checkIfUserExists = async (userId) => {
    const [user] = await db("users").where({ id: userId })

    if (user) {
      return user
    }

    throw new NotFoundError()
  }

  app.get(
    "/users",
    mw(async (req, res) => {
      const users = await db("users")

      res.send({ result: users })
    })
  )
  app.get(
    "/users/:userId",
    validate({
      params: { userId: idValdiator.required() },
    }),
    mw(async (req, res) => {
      const { userId } = req.data.params
      const user = await checkIfUserExists(userId)

      if (!user) {
        return
      }

      res.send({ result: user })
    })
  )
  app.patch(
    "/users/:userId",
    validate({
      params: { userId: idValdiator.required() },
      body: {
        firstName: nameValidator,
        lastName: nameValidator,
        email: emailValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        body: { firstName, lastName, email },
        params: { userId },
      } = req.data
      const user = await checkIfUserExists(userId, res)

      if (!user) {
        return
      }

      const [updatedUser] = await db("users")
        .update({
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
        })
        .where({ id: userId })
        .returning("*")

      res.send({ result: updatedUser })
    })
  )
  app.delete(
    "/users/:userId",
    validate({
      params: { userId: idValdiator.required() },
    }),
    mw(async (req, res) => {
      const { userId } = req.data.params
      const user = await checkIfUserExists(userId, res)

      if (!user) {
        return
      }

      await db("users").delete().where({ id: userId })

      res.send({ result: user })
    })
  )
}

export default makeRoutesUsers
