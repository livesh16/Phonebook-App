const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

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

morgan.token("data", (req, res) => {
  const { body } = req;

  return JSON.stringify(body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(cors())
app.get('/', (request, response) => {
    response.send('<h1>Hello World!!</h1> <div>hey</div>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people. <br/> ${Date()}`)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {    
        response.json(person)  
    } 
    else {    
        response.status(404).end()  
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const generateId = (max) => {
    return Math.floor(Math.random() * max);
  }

const isNameAlreadyUsed = (name) => {
  for(let i = 0; i < persons.length; i++) {
    if(persons[i].name === name) {
      return true
    }
  }
  return false
}
  
app.post('/api/persons', (request, response) => {
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
    if(isNameAlreadyUsed(body.name)) {
      return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    }

    const person = {
      id: generateId(1000),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  /*
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  */
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })




 