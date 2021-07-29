const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://superadmin:${password}@cluster0.o7ojv.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const schema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', schema)
const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})


if (process.argv.length > 3) {
  person.save().then(r => {
    console.log(`Added ${process.argv[3]} (${process.argv[4]}) to phonebook!`)
    mongoose.connection.close()
  })
  .catch(e => console.log(e))
} else {
  Person.find({}).then(r => {
    if (r.length === 0) console.log(`Sure is empty around here`)
    r.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
  })
}