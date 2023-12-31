npx prisma migrate dev --name init --schema=prisma/sqlite-schema.prisma
npx prisma migrate deploy --schema=prisma/sqlite-schema.prisma
npx prisma generate --schema=prisma/sqlite-schema.prisma
# npx prisma db seed