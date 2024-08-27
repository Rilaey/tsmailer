import { MongoClient } from "mongodb";

const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

export default clientPromise;
