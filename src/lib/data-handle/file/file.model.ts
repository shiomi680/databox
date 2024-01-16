import { Column, ObjectIdColumn, createConnection, getConnectionOptions, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class File {
  // @PrimaryGeneratedColumn("uuid")
  @ObjectIdColumn()
  Id: string

  @Column()
  FileName: string

  @Column()
  FilePath: string

  constructor(fileName: string, filePath: string) {
    this.FileName = fileName;
    this.FilePath = filePath;
  }

}