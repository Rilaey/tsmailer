import { MongoDBAdapter as DefaultMongoDBAdapter } from "@next-auth/mongodb-adapter";
import { IUser } from "@repo/types";
import { MongoClient } from "mongodb";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

const CustomMongoDBAdapter = {
  ...DefaultMongoDBAdapter(clientPromise),

  async createUser(user: IUser) {
    console.log(process.env.DASHBOARD_API_URL)
    const response = await fetch(
      `${process.env.DASHBOARD_API_URL}/api/oAuthSignIn`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ user: user })
      }
    );

    const data = await response.json();

    return data;
  }
};

export { clientPromise, CustomMongoDBAdapter };
