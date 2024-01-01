//import { useState } from 'react'
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/personServices'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response)
    })
  }, [])

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((x) => x.name === newName.trim())) {
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with new one?`
      )
      modifyPerson()
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          setNotificationMessage(error.response.data.error)
        })
      setNotificationMessage(`Added ${newName}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const modifyPerson = () => {
    const person = persons.find((p) => p.name === newName.trim())
    const changedNumber = { ...person, number: newNumber }

    personService
      .modify(person.id, changedNumber)
      .then((response) => {
        setPersons(persons.map((p) => (person.id !== p.id ? p : response)))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(`Modified ${person.name}s phonenumber`)
      })
      .catch((error) => {
        setNotificationMessage(error.response.data.error)
      })
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  const deletePerson = (id) => {
    const poistettava = persons.find((p) => p.id === id)

    if (window.confirm(`Delete ${poistettava.name}?`)) {
      personService
        .destroy(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`You deleted ${poistettava.name}!`)
        })
        .catch((error) => {
          setNotificationMessage(
            `Information of ${poistettava.name} has already been removed from server!`
          )
        })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage}></Notification>
      <Filter value={newFilter} onChange={handleFilterChange}></Filter>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        name={newName}
        number={newNumber}
        handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} destroy={deletePerson}></Persons>
    </div>
  )
}

export default App
