import { MongoDBAdapter as DefaultMongoDBAdapter } from "@next-auth/mongodb-adapter";
import { IUser } from "@repo/types";
import { MongoClient, ObjectId as MongoDBObjectId } from "mongodb";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

const CustomMongoDBAdapter = {
  ...DefaultMongoDBAdapter(clientPromise),

  async createUser(user: IUser) {
    const db = (await clientPromise).db();

    const newUser = {
      ...user,
      _id: new MongoDBObjectId()
    };

    const newLogsObject = {
      _id: new MongoDBObjectId(),
      userId: newUser._id,
      message: "Account created.",
      state: "Success",
      variation: "Account"
    };

    await db.collection("users").insertOne(newUser);
    await db.collection("logs").insertOne(newLogsObject);

    return { ...newUser, id: newUser._id.toString() };
  }
};

export { clientPromise, CustomMongoDBAdapter };
