const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const port = process.env.port || 3001;

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(morgan(":method :url :status :body"));

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);
  if (!person) {
    return res
      .status(404)
      .send("<h1>Person with the given id is not found.</h1>");
  }
  res.json(person);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res
      .status(400)
      .json({ error: "You must provide both number and name" });
  }

  const doesExist = data.some((data) => data.name === body.name);

  if (doesExist) {
    return res
      .status(400)
      .json({ error: "Person with the given name already exists." });
  }

  const id = Math.round(Math.random() * 1000);
  const newPerson = { id, ...body };
  data.push(newPerson);
  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.send(`
  <p>Phonebook has info for ${data.length} people</p>
  <p>${new Date()}</p>
  `);
});

app.use(unknownEndpoint);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
