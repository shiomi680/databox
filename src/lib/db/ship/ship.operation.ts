import { ShippingModel, ShippingRevisionModel, ShippingInput } from "./ship.model";
import { connectDB } from "../db-connect";
import { RevisionService } from "../revision/revision.operation";

export const shipRevisionService = new RevisionService(ShippingRevisionModel)


export async function addNewShipping(ship: ShippingInput, commitComment: string) {
  await connectDB()
  const newShipping = new ShippingModel(ship);
  const savedShipping = await newShipping.save();

  await shipRevisionService.createRevisionData(savedShipping, commitComment);
  return await shipRevisionService.attachRevisionsToData(savedShipping.toJSON(), savedShipping.Id);

}

export async function updateShipping(id: string, ship: ShippingInput, commitComment: string) {
  await connectDB()
  const updatedShipping = await ShippingModel.findByIdAndUpdate(id, ship, { new: true });
  if (!updatedShipping) {
    return null;
  }

  shipRevisionService.createRevisionData(updatedShipping, commitComment)

  return await shipRevisionService.attachRevisionsToData(updatedShipping.toJSON(), updatedShipping.Id);
}

export async function readShippingList() {
  await connectDB()
  const shippings = await ShippingModel.find();
  return shippings.map(x => x.toJSON());
}

export async function readShipping(id: string) {
  await connectDB()
  const shipping = await ShippingModel.findById(id);
  if (shipping) {
    return await shipRevisionService.attachRevisionsToData(shipping.toJSON(), id);
  }
}
