import { MongoDBAdapter as DefaultMongoDBAdapter } from "@next-auth/mongodb-adapter";
import { IUser } from "@repo/types";
import moment from "moment";
import { MongoClient, ObjectId as MongoDBObjectId } from "mongodb";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

const CustomMongoDBAdapter = {
  ...DefaultMongoDBAdapter(clientPromise),

  async createUser(user: IUser) {
    const db = (await clientPromise).db();

    const newUser = {
      ...user,
      _id: new MongoDBObjectId(),
      logsId: new MongoDBObjectId(),
      emailAccountsId: new MongoDBObjectId()
    };

    const newEmailAccountObject = {
      _id: new MongoDBObjectId(),
      userId: newUser._id
    };

    const newLogsObject = {
      _id: new MongoDBObjectId(),
      userId: newUser._id,
      entries: [
        {
          message: "Account created.",
          state: "Success",
          variation: "Account",
          date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        }
      ]
    };

    await db.collection("users").insertOne(newUser);
    await db.collection("emailaccounts").insertOne(newEmailAccountObject);
    await db.collection("logs").insertOne(newLogsObject);

    newUser.logsId = newLogsObject._id;
    newUser.emailAccountsId = newEmailAccountObject._id;

    await db
      .collection("users")
      .updateOne({ _id: newUser._id }, { $set: newUser }, { upsert: true });

    return { ...newUser, id: newUser._id.toString() };
  }
};

export { clientPromise, CustomMongoDBAdapter };
