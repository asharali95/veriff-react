const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_STRING).then((connection) => {
  console.log("mongoDB connected");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
