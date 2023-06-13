/*Command-line database*/

const mongoose = require('mongoose')

// check argument password
const argvLength = process.argv.length
if (argvLength < 3) {
    console.log('give password as argument')
    process.exit(1)
}


const personSchema = new mongoose.Schema({

    name: String,
    number: String,

})

const Person = mongoose.model('Person', personSchema)

const findPerson = () => {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)

        })
        mongoose.connection.close()
    })

}

const addPersons = (name, number) => {

    const person = new Person({
        name: `${name}`,
        number: `${number}`,
    })
    saveResult(name, number, person)


}

const getData = () => {

    if (process.argv.length === 6) {
        console.log('please enclose argument with space character in quote')
        process.exit(1)
    }
    const name = process.argv[3]
    const number = process.argv[4]
    addPersons(name, number)


}

const connectToDB = () => {
    const password = process.argv[2]

    const url = `mongodb+srv://oakstan:${password}@cluster0.pf71f30.mongodb.net/phonebook?retryWrites=true&w=majority`

    mongoose.set('strictQuery', false)
    mongoose.connect(url)
    if (argvLength > 3) {
        getData()
    }
    if (argvLength === 3)
        findPerson()
}

const saveResult = (name, number, person) => {
    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

connectToDB()




