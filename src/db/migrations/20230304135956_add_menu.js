export const up = async (knex) => {
  await knex.schema.createTable("menu", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("menu")
}
