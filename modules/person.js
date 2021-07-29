const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('CONNECTING TO', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	// eslint-disable-next-line no-unused-vars
	.then(r => {
		console.log('Connected to MongoDB!')
	})
	.catch((e) => console.log('Error connecting to MongoDB!', e.message))

const schema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		unique: true
	},
	number: {
		type: String,
		minlength: 8,
		required: true
	},
})

schema.plugin(uniqueValidator)
  
schema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})
  
module.exports = mongoose.model('Person', schema)