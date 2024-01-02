import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Persons from './Persons'

test('renders content', () => {
  const persons = [
    {
      name: 'Aku ankka',
      number: '12-345678',
      id: '1',
    },
    {
      name: 'Mikki Hiiri',
      number: '12-345678',
      id: '2',
    },
  ]

  render(<Persons persons={persons} filter={''} />)

  const element1 = screen.getByText('Aku ankka 12-345678')
  expect(element1).toBeDefined()
  const element2 = screen.getByText('Mikki Hiiri 12-345678')
  expect(element2).toBeDefined()
})
