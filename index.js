require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* let persons = [

    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }

] */

app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<div>Phonebook has info for ${persons.length} persons</div>
        <div>${new Date()}</div>`
      )
    })
    .catch((error) => next(error))

  /*  const string = `<div>Phonebook has info for 5 persons</div>
       <div>${new Date()}</div>`
       res.send(string) */
})

app.get('/api/persons', (req, res, next) => {
  //res.json(persons)

  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  /* const id = Number(req.params.id)
      const person = persons.find(p => p.id === id)

      if (person) {
          res.json(person)
      } else {
          res.status(404).end()
      } */

  Person.findById(req.params.id)
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  /*
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end() */

  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing',
    })
  }

  /* if (persons.some(p => p.name === body.name)) {
          return res.status(400).json({
              error: 'name must be unique'
          })
      } */

  const person = new Person({
    name: body.name,
    number: body.number,
    //id: Math.floor(Math.random() * ((10000 - 1) + 1))
  })

  //persons = persons.concat(person)

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
