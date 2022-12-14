import { resolve } from "path"

const config = {
  port: 3001,
  db: {
    path: resolve(".db"),
  },
}

export default config
