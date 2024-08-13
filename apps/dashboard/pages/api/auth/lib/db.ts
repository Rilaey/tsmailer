import { MongoDBAdapter as DefaultMongoDBAdapter } from "@next-auth/mongodb-adapter";
import { IUser } from "@repo/types";
import { MongoClient, ObjectId } from "mongodb";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

const CustomMongoDBAdapter = {
  ...DefaultMongoDBAdapter(clientPromise),

  async createUser(user: IUser) {
    const db = (await clientPromise).db();

    const newUser = { ...user, _id: new ObjectId() };

    await db.collection("users").insertOne(newUser);

    const newEmailAccountObject = {
      _id: new ObjectId(),
      userId: newUser._id
    };

    await db.collection("emailaccounts").insertOne(newEmailAccountObject);

    return { ...newUser, id: newUser._id.toString() };
  }

  // Optionally override other methods if needed
};

export { clientPromise, CustomMongoDBAdapter };
