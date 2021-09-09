import * as dotenv from 'dotenv'

dotenv.config()

const config = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  IS_TEST: process.env.NODE_ENV === 'test'
}

export { config }
