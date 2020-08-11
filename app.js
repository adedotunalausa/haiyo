const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb+srv://admin-adedotun:Mn2mwbZXGyK45QJ@haiyo-cluster.hdjma.mongodb.net/haiyoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//////////////////Schema and model to handle names in the database//////////////////

const nameSchema = {
  name: String,
  country: String,
  tribe: String,
  meaning: String
}

const Name = mongoose.model("Name", nameSchema);

////////////////Schema and model to handle suggested names from visitors/////////////////

const suggestedNameSchema = {
  name: String,
  country: String,
  tribe: String
}

const SuggestedName = mongoose.model("SuggestedName", suggestedNameSchema);


/////////////////////////////Request handlers//////////////////////////

app.route("/")

  .get((req, res) => {
    res.render("home");
  })

  .post((req, res) => {
    const requestedName = _.lowerCase(req.body.requestedName)

    Name.findOne({
      name: requestedName
    }, (err, foundName) => {
      if (foundName) {
        res.render("success", {
          name: foundName.name,
          country: foundName.country,
          tribe: foundName.tribe,
          meaning: foundName.meaning
        });
      } else {
        res.render("failure");
      }
    });
  });

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/how-haiyo-works", (req, res) => {
  res.render("how-haiyo-works");
});

app.route("/suggestName")

.get((req, res) => {
  res.render("suggestName");
})

.post((req, res) => {
  const suggestedName = new SuggestedName({
    name: req.body.suppliedName,
    country: req.body.country,
    tribe: req.body.tribe
  });

  suggestedName.save((err) => {
    if (!err) {
      res.render("nameSaved");
    } else {
      res.redirect("/suggestName");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 7000;
}

app.listen(port, () => {
  console.log("Server has started successfully");
});
