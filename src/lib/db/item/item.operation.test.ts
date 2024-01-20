import { addNewItem, readItem, readItemList, updateItem } from "./item.operation"
import { ItemModel, Item, ItemInput } from "./item.model"

import { connectDB } from "../db-connect"
// import { initializedDataSource } from "../data-connection"
describe('insertFile', () => {
  it('renders a heading', async () => {
    await connectDB()
    const item = new Item()
    item.ItemName = "AAA"
    item.ModelNumber = "ABCDEF"
    item.Cost = 100
    item.SalePrice = 1.1
    item.Files = [
    ]
    item.Tags = []
    const rtn = await addNewItem(item, "submit")
    console.log(rtn)
    // const item2 = new Item()
    // item2.ItemName = "BBB"
    // item2.ModelNumber = "ABCDEF"
    // item2.Cost = 100
    // item2.SalePrice = 1.1
    // item2.Files = [
    //   {
    //     FileName: "aa.png",
    //     Id: "FFFF",
    //     CreateAt: "2024-1-1",
    //     Url: "http://test.png",
    //     Visible: true,
    //   }
    // ]
    // await addNewItem(item2, "submit2")
  })

  // it('read item', async () => {
  //   await connectDB()

  //   const items = await readItemList()
  //   console.log(items)
  //   const item = items.findLast(() => true)
  //   if (item?.Id) {
  //     item.ItemName = "KKKKKK"
  //     await updateItem(item.Id, item, "name change to KKKK")
  //     const rtn = await readItem(item.Id)
  //     console.log(rtn)
  //   }
  // })
})
