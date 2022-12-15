import { InvalidAccessError, NotFoundError } from "../errors.js"
import auth from "../middlewares/auth.js"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import { sanitizeUser } from "../sanitizers.js"
import { emailValidator, idValidator, nameValidator } from "../validators.js"

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
    auth,
    mw(async (req, res) => {
      const users = await db("users")

      res.send({ result: sanitizeUser(users) })
    })
  )
  app.get(
    "/users/:userId",
    validate({
      params: { userId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { userId } = req.data.params
      const user = await checkIfUserExists(userId)

      if (!user) {
        return
      }

      res.send({ result: sanitizeUser(user) })
    })
  )

  app.patch(
    "/users/:userId",
    auth,
    validate({
      params: { userId: idValidator.required() },
      body: {
        firstName: nameValidator,
        lastName: nameValidator,
        email: emailValidator,
      },
    }),
    mw(async (req, res) => {
      const {
        data: {
          body: { firstName, lastName, email },
          params: { userId },
        },
        session: { user: sessionUser },
      } = req

      if (userId !== sessionUser.id) {
        throw new InvalidAccessError()
      }

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

      res.send({ result: sanitizeUser(updatedUser) })
    })
  )
  app.delete(
    "/users/:userId",
    validate({
      params: { userId: idValidator.required() },
    }),
    mw(async (req, res) => {
      const { userId } = req.data.params
      const user = await checkIfUserExists(userId, res)

      if (!user) {
        return
      }

      await db("users").delete().where({ id: userId })

      res.send({ result: sanitizeUser(user) })
    })
  )
}

export default makeRoutesUsers
