export function up(knex) {
  return knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.string("name").notNullable().unique()
    table.json("permissions").notNullable()
  })
}

export function down(knex) {
  return knex.schema.dropTable("roles")
}
