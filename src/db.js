import { readFile, writeFile } from "node:fs/promises"

class DB {
  #db = null
  #config = null

  constructor(config) {
    this.#config = config
  }

  async connect() {
    try {
      this.#db = JSON.parse(
        await readFile(this.#config.path, { encoding: "utf-8" })
      )
    } catch (err) {
      this.#db = {
        users: {
          lastId: 0,
          records: {},
        },
      }
    }
  }

  async #flush() {
    await writeFile(this.#config.path, JSON.stringify(this.#db), {
      encoding: "utf-8",
    })
  }

  async create(resourceName, record) {
    const resource = this.#db[resourceName]
    resource.lastId += 1
    const newRecord = {
      id: resource.lastId,
      ...record,
    }
    resource.records[resource.lastId] = newRecord

    await this.#flush()

    return newRecord
  }

  read(resourceName, recordId) {
    const resource = this.#db[resourceName]

    if (recordId) {
      return resource.records[resource.lastId]
    }

    return resource.records
  }

  async update(resourceName, record) {
    const resource = this.#db[resourceName]
    const updatedRecord = {
      ...resource.records[record.id],
      ...record,
    }
    resource.records[record.id] = updatedRecord

    await this.#flush()

    return updatedRecord
  }

  async delete(resourceName, recordId) {
    const resource = this.#db[resourceName]
    const { [recordId]: deletedRecord, ...records } = resource.records
    resource.records = records

    await this.#flush()

    return deletedRecord
  }
}

export default DB
