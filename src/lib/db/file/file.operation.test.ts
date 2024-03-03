import { insertFileData } from "./file.operation"
import { connectDB } from "../db-connect"
describe('insertFile', () => {
  it('renders a heading', async () => {
    await connectDB()
    const rtn = await insertFileData("test", "aaa/bbb")
    console.log(rtn)
  })
})