export const up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("birthDate")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.date("birthDate").notNullable()
  })
}
