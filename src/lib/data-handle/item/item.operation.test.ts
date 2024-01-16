import { addNewItem, readItemData, readItemList, updateItem } from "./item.operation"
import { Item } from "./item.model"
import { File } from "../file/file.model"
import { useTestDataSourse, dataSource, initializedDataSource } from "../data-connection"
// import { initializedDataSource } from "../data-connection"
describe('insertFile', () => {
  it('renders a heading', async () => {
    await initializedDataSource
    const item = new Item()
    item.ItemName = "AAA"
    item.ModelNumber = "ABCDEF"
    item.Cost = 100
    item.SalePrice = 1.1
    item.Files = [
      {
        FileName: "aa.png",
        FileId: "AAAA",
        CreateAt: "2024-1-1"
      }
    ]
    const rtn = await addNewItem(item, "submit")
    const item2 = new Item()
    item2.ItemName = "BBB"
    item2.ModelNumber = "ABCDEF"
    item2.Cost = 100
    item2.SalePrice = 1.1
    item2.Files = [
      {
        FileName: "aa.png",
        FileId: "FFFF",
        CreateAt: "2024-1-1"
      }
    ]
    await addNewItem(item2, "submit2")
  })

  it('read item', async () => {
    await initializedDataSource
    const items = await readItemList()
    console.log(items)
    const item = items.findLast(() => true)
    if (item) {
      item.ItemName = "KKKKKK"
      await updateItem(item.ItemId.toString(), item, "name change to KKKK")
      const readItem = await readItemData(item.ItemId.toString())
      console.log(readItem)
    }
  })
})
