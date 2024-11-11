import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const ConnectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default ConnectDB;
