import { prisma } from '../../api/prisma'
import { ShippingRevision } from "@prisma/client"

export async function readShippingRevisions(shipId: number) {
  const shippingRevisions = await prisma.shippingRevision.findMany({
    where: {
      ShippingModelId: shipId
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      ShippingRevisionId: true,
      Comment: true,
      createdAt: true
    }
  })
  return shippingRevisions
}

export async function readTargetRevisionData(revisionId: number) {
  const revision = await prisma.shippingRevision.findUnique({
    where: {
      ShippingRevisionId: revisionId
    },
    include: {
      ShippingFileMappings: {
        include: {
          FileModel: true
        }
      }
    }
  })
  return revision
}

type ShippingRevisionSubset = Omit<ShippingRevision, 'ShippingRevisionId' | 'createdAt' | 'ShippingModelId'>;

export async function createOrUpdateShipping(data: ShippingRevisionSubset, ShippingModelId?: number,) {
  const shipId = await getOrCreateShipId(ShippingModelId)
  const newRevision = await prisma.shippingRevision.create({
    data: {
      ...data,
      ShippingModelId: shipId,
    }
  });
  return newRevision
}

async function getOrCreateShipId(shipModelId?: number) {
  if (shipModelId) {
    const foundShip = await prisma.shippingModel.findUnique({
      where: {
        ShippingId: shipModelId
      }
    })
    if (foundShip) {
      return foundShip.ShippingId
    } else {
      return await createShipId()
    }
  } else {
    return await createShipId()
  }
}

async function createShipId() {
  const ship = await prisma.shippingModel.create({})
  return ship.ShippingId
}

export async function findManyShippingModel() {
  return await prisma.shippingModel.findMany({
    include: {
      ShippingRevisions: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1,
        include: {
          ShippingFileMappings: {
            include: {
              FileModel: true
            }
          }
        }
      },
    }
  });
}