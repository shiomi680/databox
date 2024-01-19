import { Expand } from "@mui/icons-material";
import { Column, ObjectIdColumn, createConnection, getConnectionOptions, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class File {
  @ObjectIdColumn()
  FileId: string

  @Column()
  FileName: string

  @Column()
  FilePath: string

  @Column()
  CreateAt: string

  constructor(fileName: string, filePath: string, createAt?: string) {
    this.FileName = fileName;
    this.FilePath = filePath;
    if (createAt) {
      this.CreateAt = createAt
    }
    else {
      const now = new Date()
      this.CreateAt = now.toISOString()
    }
  }
}

@Entity()
export class FileAtatchment {
  @Column()
  FileId: string
  @Column()
  Url: string
  @Column()
  FileName: string
  @Column()
  CreateAt: string
  @Column()
  Visible: boolean
}