const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const shipping1 = await prisma.shippingModel.create({
    data: {
      ShipDate: new Date(),
      ShipFrom: 'AGG',
      ShipTo: 'AGS',
      Title: 'Shipping 1',
      ShippingInvoicePrice:100,
      ShippingInvoiceCurrency:"USD" ,
      TradeTerm: 'EXW',
      AcquisitionDate: new Date(year=2023, monthIndex=0, date=20),
      AcquisitionPrice: 1000.00,
      BookValue: 1000.00,
      Defrayer: 'AGG',
      Comment: 'No comment',
      CommentAboutSale: 'No comment',
      Gx: "none",
      CommentAboutAcquisition: 'No comment',
      InvoiceNo: 'INV12345',
      Carrier: 'Carrier A',
      AwbNo: 'AWB12345',
      ExportPermission: "",
    },
  });

  const file1 = await prisma.fileModel.create({
    data: {
      OwnerShippingId: shipping1.ShippingId,
      FileName: 'file1.txt',
      FilePath: '/path/to/file1.txt',
      UploadTimestamp: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
