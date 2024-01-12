require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const Person = require("./models/Person.js");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :body"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((data) => res.json(data));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: "Malformatted id" });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res
      .status(400)
      .json({ error: "You must provide both number and name" });
  }

  Person.find({ name: body.name }).then((person) => {
    if (person.length > 0) {
      const updateNumber = {
        name: body.name,
        number: body.number,
      };
      Person.findByIdAndUpdate(person[0]._id.toString(), updateNumber, {
        new: true,
      })
        .then((data) => console.log(data))
        .catch((err) => next(err));
    } else {
      const newPerson = new Person({
        name: body.name,
        number: body.number,
      });

      newPerson
        .save()
        .then((data) => res.json(data))
        .catch((err) => next(err));
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((data) => res.status(204).end())
    .catch((err) => console.log(err));
});

app.get("/info", (req, res) => {
  Person.countDocuments().then((count) => {
    res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>
    `);
  });
});

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
