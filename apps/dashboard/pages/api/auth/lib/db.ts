import { MongoDBAdapter as DefaultMongoDBAdapter } from "@next-auth/mongodb-adapter";
import { IUser } from "@repo/types";
import { MongoClient, ObjectId } from "mongodb";
import { User } from "@repo/models";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

const CustomMongoDBAdapter = {
  ...DefaultMongoDBAdapter(clientPromise),

  async createUser(user: IUser) {
    const db = (await clientPromise).db();
    const newUser = {
      ...user,
      _id: new ObjectId()
    };

    // const matchedUser = await User;

    await db.collection("users").insertOne(newUser);

    const newEmailAccountObject = {
      _id: new ObjectId(),
      userId: newUser._id
    };

    await db.collection("emailaccounts").insertOne(newEmailAccountObject);

    // Return the user with the custom field included
    return { ...newUser, id: newUser._id.toString() };
  }

  // Optionally override other methods if needed
};

export default CustomMongoDBAdapter;
