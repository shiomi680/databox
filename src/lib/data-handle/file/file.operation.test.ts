import { insertFileData } from "./file.operation"
import { initializedDataSource } from "../data-connection"
describe('insertFile', () => {
  it('renders a heading', async () => {
    await initializedDataSource
    const rtn = await insertFileData("test", "aaa/bbb")
    console.log(rtn)
  })
})