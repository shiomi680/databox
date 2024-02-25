import { ShippingModel, ShippingRevisionModel, ShippingInput } from "./ship.model";
import { connectDB } from "../db-connect";
import { createRevisionFunctions } from "../revision/revision.operation";

const functions = createRevisionFunctions(ShippingRevisionModel);
const addShippingRevision = functions.createRevisonData;
const attachRevisionsToShipping = functions.attachRevisionsToData;
export const readShippingByRevision = functions.readDataByRevisionId



export async function addNewShipping(ship: ShippingInput, commitComment: string) {
  await connectDB()
  const newShipping = new ShippingModel(ship);
  const savedShipping = await newShipping.save();

  await addShippingRevision(savedShipping, commitComment);
  return await attachRevisionsToShipping(savedShipping.toJSON(), savedShipping.Id);

}

export async function updateShipping(id: string, ship: ShippingInput, commitComment: string) {
  await connectDB()
  const updatedShipping = await ShippingModel.findByIdAndUpdate(id, ship, { new: true });
  if (!updatedShipping) {
    return null;
  }

  addShippingRevision(updatedShipping, commitComment)

  return await attachRevisionsToShipping(updatedShipping.toJSON(), updatedShipping.Id);
}

export async function readShippingList() {
  await connectDB()
  const shippings = await ShippingModel.find();
  const rtn = shippings.map(x => x.toJSON());
  return rtn
}

export async function readShipping(id: string) {
  await connectDB()
  const shipping = await ShippingModel.findById(id);
  if (shipping) {
    const rtn = await attachRevisionsToShipping(shipping.toJSON(), id);
    return rtn
  }
}
