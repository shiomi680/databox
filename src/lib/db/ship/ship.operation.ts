import { ShippingModel, ShippingRevisionModel, Shipping, ShippingInput, ShippingRevision } from "./ship.model";
import { connectDB } from "../db-connect";
import { RevisionInfo } from "../revision/revision.model";

export async function addNewShipping(ship: ShippingInput, commitComment: string) {
  await connectDB()
  const newShipping = new ShippingModel(ship);
  const savedShipping = await newShipping.save();

  const revision = new ShippingRevisionModel({
    Shipping: savedShipping,
    ObjectId: savedShipping._id.toString(),
    CommitComment: commitComment
  });
  await revision.save();

  return await shipAddRevisions(savedShipping.toJSON(), savedShipping.Id);
}

export async function updateShipping(id: string, ship: ShippingInput, commitComment: string) {
  await connectDB()
  const updatedShipping = await ShippingModel.findByIdAndUpdate(id, ship, { new: true });
  if (!updatedShipping) {
    return null;
  }

  const revision = new ShippingRevisionModel({
    Shipping: updatedShipping,
    ObjectId: updatedShipping.Id,
    CommitComment: commitComment
  });
  await revision.save();

  return await shipAddRevisions(updatedShipping.toJSON(), updatedShipping.Id);
}

export async function readShippingList() {
  await connectDB()
  const shippings = await ShippingModel.find();
  const rtn = shippings.map(x => x.toJSON());
  console.log(rtn)
  return rtn
}

export async function readShipping(id: string) {
  await connectDB()
  const shipping = await ShippingModel.findById(id);
  if (shipping) {
    const rtn = await shipAddRevisions(shipping.toJSON(), id);
    return rtn
  }
}

export async function readShippingByRevision(shipId: string, revisionId: string) {
  await connectDB()
  const revision = await ShippingRevisionModel.findById(revisionId);
  if (revision?.Shipping) {
    return await shipAddRevisions(revision.Shipping, shipId);
  } else {
    return
  }
}

async function getTargetShippingsRevisions(objectId: string) {
  await connectDB()
  const revisions = await ShippingRevisionModel.find({ ObjectId: objectId }, "_id CommitComment CreateAt").sort('-CreateAt');
  const rtn: RevisionInfo[] = revisions.map(x => x.toJSON())
  return rtn
}

async function shipAddRevisions(ship: Shipping, objectId: string) {
  await connectDB()
  const revisions = await getTargetShippingsRevisions(objectId)
  return {
    ...ship,
    Id: ship.Id,
    Revisions: revisions
  };
}
