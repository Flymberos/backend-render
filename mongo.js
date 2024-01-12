const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = String(process.argv[3]);
const number = String(process.argv[4]);

const url = `mongodb+srv://benjaminpasic1:${password}@cluster0.hnybw27.mongodb.net/phonebookapp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3 && password) {
  Person.find({}).then((data) => {
    data.forEach((piece) => console.log(piece));
    mongoose.connection.close();
    process.exit(1);
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log("person saved! " + result);
    mongoose.connection.close();
  });
}
