import { DataSource } from "typeorm"
import { File } from "./file/file.model"
import { Item, ItemRevision } from "./item/item.model"
import { MongoMemoryServer } from 'mongodb-memory-server'

const prodDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  port: 27017,
  database: "data-box",
  entities: [File, Item, ItemRevision],
  synchronize: true,
})

const testDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  port: 27111,
  database: "data-box",
  entities: [File, Item, ItemRevision],
  synchronize: true,
})

export const useTestDataSourse = async () => {
  const mongod = await MongoMemoryServer.create(
    {
      instance: {
        port: 27111,
        dbName: "data-box",

      }, spawn: {}
    }
  )
  return await testDataSource.initialize();
}




export const dataSource = process.env.NODE_ENV === 'test' ? testDataSource : prodDataSource;


export const initializedDataSource = process.env.NODE_ENV === 'test' ? useTestDataSourse() : dataSource.initialize();
