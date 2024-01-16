import { Entity, ObjectId, PrimaryGeneratedColumn, ObjectIdColumn, Column, ManyToMany, JoinTable } from "typeorm";
// import { ObjectId } from 'mongodb';

type FileElement = {
  FileId: string
  FileName: string
  CreateAt: string
}

@Entity()
export class ItemInfo {
  @Column()
  ModelNumber: string

  @Column()
  ItemName: string

  @Column()
  ItemDescription: string

  @Column('decimal')
  Cost: number

  @Column('decimal')
  SalePrice: number

  @Column()
  Files: FileElement[]

  @Column()
  Tags: string[]
}

@Entity()
export class RevisionBase {
  @ObjectIdColumn()
  RevisionId: ObjectId

  @Column()
  TargetId: string

  @Column()
  CreateAt: string

  @Column()
  CommitComment: string
}

@Entity()
export class Item extends ItemInfo {
  @ObjectIdColumn()
  ItemId: ObjectId

  @Column()
  Revisions: RevisionBase[]
}

@Entity()
export class ItemRevision extends RevisionBase {
  @Column()
  Item: ItemInfo
}