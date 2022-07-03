require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
const mongoose = require('mongoose')
const person = require('./models/person')

let numberOfPeop = 0
/*
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
*/

morgan.token("data", (req, res) => {
  const { body } = req;

  return JSON.stringify(body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(express.static('build'))

/*
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
*/

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!!</h1> <div>hey</div>')
  })
  
app.get('/api/persons', (request, response) => {
    Person.find().then(persons => {
      //console.log(persons.length)
      response.json(persons)
    })
  })

app.get('/info', (req, res) => {
    Person.find({}).then((persons) => {
      res.send(
      `<div>
        <span>Phonebook has info for ${persons.length} people</span>
      </div>
      <span>${new Date().toString()}</span>`,
      )
    })
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {        
        response.json(note)      
      } 
      else {        
        response.status(404).end()      
      }    
    })
    .catch(error => next(error))
    /*
    .catch(error => {      
      console.log(error)      
      response.status(400).send({ error: 'malformatted id' })
    })
    */
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
  })

const generateId = (max) => {
    return Math.floor(Math.random() * max);
  }

  /*
const isNameAlreadyUsed = (name) => {
  for(let i = 0; i < persons.length; i++) {
    if(persons[i].name === name) {
      return true
    }
  }
  return false
}
*/

app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name missing' 
      })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'Number missing' 
      })
    }
    /*
    if(isNameAlreadyUsed(body.name)) {
      return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    }
    */

    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
    
    
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
  })

  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {    
    return response.status(400).json({ error: error.message })  
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })




 