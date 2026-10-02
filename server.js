require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { startScheduler } = require("./src/scheduler");
const createIndexes = require("./src/config/indexes");

const PORT = process.env.PORT || 5050;

const start = async () => {
  await connectDB();
  await createIndexes();
  startScheduler();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();