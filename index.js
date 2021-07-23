const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
let persons = require('./persons')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  res.json(persons.array)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.array.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end('Person with that ID could not be found!')
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.array.find(p => p.id === id)
  if (person) {
    persons.array = persons.array.filter(p => p.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end('Person with that ID could not be found!')
  }
})

app.post('/api/persons/', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) return res.status(400).end('Submit both the name and number of new person!')
  if (persons.array.find(p => p.name === body.name)) return res.status(400).end('This name is already in the phonebook!')

  const person = {
    id: Math.floor(Math.random() * (1000 - 5) + 5),
    name: body.name,
    number: body.number
  }
  persons.array = persons.array.concat(person)
  res.json(person)
})

app.get('/info', (req, res) => {
  res.send(`
    There are <b>${persons.array.length}</b> people in the phonebook.
    <p>${new Date()}</p>
    `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Running on ${PORT}`)
})