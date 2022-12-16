export const up = async (knex) => {
  await knex.schema.createTable("species", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("pets", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("weight").notNullable()
    table.timestamps(true, true, true)
    table.integer("userId").notNullable().references("id").inTable("users")
    table.integer("speciesId").notNullable().references("id").inTable("species")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("pets")
  await knex.schema.dropTable("species")
}
