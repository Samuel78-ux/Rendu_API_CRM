import { faker } from "@faker-js/faker"
import knex from "knex"
import config from "../config.js"

// const requests = [...new Array(100)].map(() => {
//   const firstName = faker.name.firstName()
//   const lastName = faker.name.lastName()

//   return async () =>
//     axios.post(`http://localhost:${config.port}/sign-up`, {
//       firstName,
//       lastName,
//       email: faker.internet.email(firstName, lastName),
//       password: "qweQWE123!@#",
//     })
// })

// const runSeries = async (promises, i = 0) => {
//   if (!promises[i]) {
//     return
//   }

//   console.log(`REQUEST #${i}`)

//   try {
//     await promises[i]()
//   } catch (err) {
//     console.error(err)
//   }

//   console.log(`DONE, NEXT REQUEST #${i + 1}`)

//   return runSeries(promises, i + 1)
// }

// await runSeries(requests)

const species = ["cat", "dog", "bird"]

const db = knex(config.db)

await db("pets").insert(
  [...new Array(100)].map(() => {
    const speciesIndex = species.indexOf(faker.helpers.arrayElement(species))

    return {
      name: `${faker.name.firstName()} the ${faker.animal[
        species[speciesIndex]
      ]()}`,
      weight: faker.datatype.number({ min: 1, max: 10 }),
      speciesId: speciesIndex + 1,
      userId: faker.datatype.number({ min: 1, max: 485 }),
    }
  })
)

process.exit(0)
