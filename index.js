const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./modules/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status - :response-time ms :body'))

const errorHandler = (e, req, res, next) => {
	console.error(e.message)
	if (e.name === 'CastError') {
		return res.status(400).send(e.message)
	} else if (e.name === 'ValidationError') {
		return res.status(400).send('Name must be longer than 3 characters and number longer than 8!')
	}
	next(e)
}

app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(people => res.json(people))
		.catch(e => next(e))
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(p => {
		if (p) {
			res.json(p)
		} else {
			res.status(404).send('404 Not Found: Person with that ID does not exist!')
		}
	})
		.catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch(e => next(e))
})

app.post('/api/persons/', (req, res, next) => {
	const body = req.body
	const person = new Person({
		name: body.name,
		number: body.number
	})
	person.save().then(p => res.json(p))
		.catch(e => next(e))
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body
	const person = {
		name: body.name,
		number: body.number
	}
	Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => res.json(updatedPerson))
		.catch(e => next(e))
})

app.get('/info', (req, res, next) => {
	Person.countDocuments({}, (e, count) => {
		res.send(`
    There are <b>${count}</b> people in the phonebook.
    <p>${new Date()}</p>
    `)
	})
		.catch(e => next(e))
})

const notFound = (req, res) => res.status(404).send('Error 404: Not found!')

app.use(notFound)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Running on ${PORT}`)
})