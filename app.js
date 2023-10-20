
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const registrationController = require("./controllers/registration");
const app = express();

//body parse
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// parse application/json
app.use(bodyParser.json({ limit: "50mb", extended: true }));

var whitelist = [
  "http://localhost:4200",
  "http://localhost:4201"
];

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) != -1) {
      callback(null, true);
    } else {
      console.log("Not allowed by CORS origin:" + origin);
      callback(new Error("Not allowed by CORS origin:" + origin));
    }
  },
};

app.use(cors(corsOptions));

// custom routes

var api_version = process.env.api_version;

app.use(api_version, require("./routes/registration"));
app.use(api_version, require("./routes/ride"));

app.get(api_version + "/welcome", (req, res) => {
  res.status(200).json({message:"Welcome to the tazi"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
