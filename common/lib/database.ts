
import { config } from './config'

import {
  connect as dbConnect,
  disconnect as dbDisconnect,
  connection
} from 'mongoose'

/**
 * every test use a new instance of database
 */
const memoryDatabases: any[] = []

const connect = async () => {
  const isAlreadyConnected = connection.readyState === 1
  if (isAlreadyConnected) {
    return connection
  }

  const mongoConfig = {
    useNewUrlParser: true,
    ignoreUndefined: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }

  if (config.IS_TEST) {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const memoryServer = new MongoMemoryServer({
      instance: {
        dbName: 'localhost-memory-database-for-tests',
        port: 27017
      }
    })

    const databaseURL = await memoryServer.getUri()

    memoryDatabases.push(memoryServer)
    return await dbConnect(databaseURL, mongoConfig)
  }

  return await dbConnect(config.DATABASE_URL, mongoConfig)
}

const disconnect = async () => {
  await dbDisconnect()

  if (config.IS_TEST) {
    for (const db of memoryDatabases) {
      await db.stop()
    }
  }
}

const validationMessage = (fieldName: string): string => `O campo ${fieldName} é obrigatório`

const Defaults = {
  validationMessage
}

export {
  connect,
  Defaults,
  disconnect
}
