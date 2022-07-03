const mongoose = require('mongoose')
//console.log(process.argv.length)
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

//mongodb+srv://fullstack:$<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority
const url = `mongodb+srv://fullstack:${password}@fso.z1u3n.mongodb.net/noteApp?retryWrites=true&w=majority`
const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length == 3) {
  mongoose
  .connect(url)
  .then((result) => {
    console.log('Phonebook:')
      Person
        .find({})
        .then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
    })
}

else {
  mongoose
    .connect(url)
    .then((result) => {
      const person = new Person({
        name: name,
        number: number,
      })
  
      return person.save()
    })
  .then(() => {
    console.log('Person saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
}

