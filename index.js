/*Command line database*/

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('build'))


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id) // id must be a number
    persons = persons.filter(person => person.id !== id) // removes deleted
    response.status(204).end() // successful deletion.No data returned

})

const password = process.argv[2]
const url = `mongodb+srv://oakstan:${password}@cluster0.pf71f30.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({

    name: String,
    number: String,

})

personSchema.set('toJson', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (request, response) => {

    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const pers = persons.filter(person => person.id === id)
    if (pers[0]) {
        response.json(pers)
    }
    else {
        response.status(404).send(`<div><strong>The requested id ${id} and associated information do not exist!</strong></div>`)
    }

})

const generateId = (min, max) => {
    return Math.floor(Math.random() * (1000))
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ error: "name missing" })
    }
    if (!body.number) {
        return response.status(400).json({ error: "number missing" })
    }
    if (persons.find(n => n.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({ error: "name must be unique" })
    }
    // create person object. Use random number generated id.   
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => { console.log(`Running on port ${PORT}`) })