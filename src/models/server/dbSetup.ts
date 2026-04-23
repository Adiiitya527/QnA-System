import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connected!");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database created!");
    } catch (err) {
      console.log("Error creating database", err);
    }
  }

  // ✅ Always ensure collections exist
  await Promise.all([
    safeRun(createQuestionCollection, "Question"),
    safeRun(createAnswerCollection, "Answer"),
    safeRun(createCommentCollection, "Comment"),
    safeRun(createVoteCollection, "Vote"),
  ]);

  console.log("All collections ensured!");

  return databases;
}

async function safeRun(fn: () => Promise<any>, name: string) {
  try {
    await fn();
  } catch (e) {
    console.log(`${name} collection may already exist`);
  }
}