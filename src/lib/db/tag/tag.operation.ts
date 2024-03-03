import { connectDB } from "../db-connect";
import { TagModel } from "./tag.model";

export async function addTag(tagName: string) {
  await connectDB();
  // Correctly search for a tag by its name
  const existTag = await TagModel.findOne({ TagName: tagName });

  // If the tag does not exist, add it to the database
  if (!existTag) {
    const newTag = new TagModel({ TagName: tagName });
    return await newTag.save();
  }
}

export async function addTagList(tagNames: string[]) {
  await connectDB();
  // Find tags that already exist in the database
  const existingTags = await TagModel.find({
    TagName: { $in: tagNames }
  });

  // Extract the names of tags that already exist
  const existingTagNames = existingTags.map(tag => tag.TagName);

  // Filter out the tag names that already exist
  const newTagNames = tagNames.filter(tagName => !existingTagNames.includes(tagName));

  // Create new tag documents for insertion
  const newTags = newTagNames.map(tagName => ({ TagName: tagName }));

  // Insert new tags in bulk if there are any
  if (newTags.length > 0) {
    await TagModel.insertMany(newTags);
  }

}

export async function readTagList(): Promise<string[]> {
  await connectDB();
  const tags = await TagModel.find({});
  return tags.map(tag => tag.TagName);
}