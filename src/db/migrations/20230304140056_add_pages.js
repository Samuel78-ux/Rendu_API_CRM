export const up = async (knex) => {
  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.text("urlSlug").notNullable()
    table.text("creator").notNullable()
    table
      .integer("menu")
      .notNullable()
      .references("id")
      .inTable("menu")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
    table.timestamps(true, true, true)
    table.enu("status", ["draft", "published"]).notNullable().defaultTo("draft")
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("pages")
}
