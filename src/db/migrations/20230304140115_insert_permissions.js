export function up(knex) {
  return knex("roles").insert([
    {
      name: "admin",
      permissions: {
        pages: { create: true, read: true, update: true, delete: true },
        signs: { create: true, read: true, update: true, delete: true },
        menu: { create: true, read: true, update: true, delete: true },
      },
    },
    {
      name: "manager",
      permissions: {
        pages: { create: true, read: true, update: true, delete: true },
        users: { create: false, read: false, update: false, delete: false },
        menu: { create: true, read: true, update: true, delete: true },
      },
    },
    {
      name: "editor",
      permissions: {
        pages: { create: false, read: true, update: true, delete: false },
        users: { create: false, read: true, update: true, delete: false },
        menu: { create: false, read: true, update: true, delete: false },
      },
    },
  ])
}

export function down(knex) {
  return knex("roles").del()
}
