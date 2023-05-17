'use strict'

// Get current date
const currentDate = new Date()
const currentDay = currentDate.getDate()

// Get month and year
const options = { month: 'long', year: 'numeric' }
const monthYearString = currentDate.toLocaleDateString('en-US', options)

// Set month and year in the calendar header
document.querySelector('.month').textContent = monthYearString

// Generate calendar days
const calendarDays = document.querySelector('.row')

for (let day = 1; day <= 31; day++) {
  const calendarDay = document.createElement('div')
  calendarDay.classList.add('col-2', 'day')
  calendarDay.textContent = day

  if (day === currentDay) {
    calendarDay.classList.add('today')
  }

  calendarDays.appendChild(calendarDay)
}

// Function to handle event booking
async function bookEvent (EventId, EventDate) {
  const PersonId = 2 // Hard-coded personId for example purposes, you should replace it with the actual personId logic
  const date = new Date(EventDate)
  const formattedDate = date.toLocaleDateString().split('T')[0]

  const bookingData = {
    eventId: EventId,
    personId: PersonId,
    Date: formattedDate // Use the current date as the booking date
  }

  try {
    const response = await $.ajax({
      type: 'POST',
      url: '/event_booking',
      data: JSON.stringify(bookingData),
      contentType: 'application/json'
    })

    if (response.status === 'Success') {
      alert('Event booked successfully!')
    } else {
      alert('Error booking event.')
    }
  } catch (error) {
    console.error('Error booking event:', error)
    alert('Error booking event.')
  }
}

// Generate HTML table dynamically
function generateTable (events) {
  const table = document.createElement('table')
  table.id = 'openConsultationTable'
  table.classList.add('table', 'table-striped')

  const thead = document.createElement('thead')
  thead.classList.add('thead-dark')

  const tbody = document.createElement('tbody')

  // Create table header row
  const headerRow = document.createElement('tr')
  Object.keys(events[0][0]).forEach(key => {
    const th = document.createElement('th')
    th.textContent = key
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)

  // Create table body rows
  events[0].forEach(event => {
    const row = document.createElement('tr')
    Object.entries(event).forEach(([key, value]) => {
      const cell = document.createElement('td')

      if (key === 'EventDate') {
        const firstOccurrence = new Date(value)
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        const dateString = firstOccurrence.toLocaleDateString('en-US', options)

        cell.textContent = dateString
      } else {
        cell.textContent = value
      }

      row.appendChild(cell)
    })

    // Create a button element
    const buttonCell = document.createElement('td')
    const bookButton = document.createElement('button')
    bookButton.textContent = 'Book'
    bookButton.classList.add('btn', 'btn-primary')
    // Add event listener to the button
    bookButton.addEventListener('click', function () {
      bookEvent(event.EventId, event.EventDate)
    })
    buttonCell.appendChild(bookButton)
    row.appendChild(buttonCell)

    tbody.appendChild(row)
  })

  // Append thead and tbody to the table
  table.appendChild(thead)
  table.appendChild(tbody)

  return table
}
function sortEvents (events) {
  events[0].sort((a, b) => {
    const dateA = new Date(a.EventDate)
    const dateB = new Date(b.EventDate)

    // Compare the dates
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // If the dates are the same, compare the times
    const timeA = new Date(`1970-01-01T${a.EventStartTime}`)
    const timeB = new Date(`1970-01-01T${b.EventStartTime}`)

    return timeA - timeB
  })
}

function generateLecturerOptions (events) {
  const listOfLecturers = []
  events[0].forEach(event => {
    Object.entries(event).forEach(([key, value]) => {
      if (key === 'PersonName') {
        listOfLecturers.push(value)
      }
    })
  })
  return new Set(listOfLecturers)
}

function generateHTMLLectuerOptions (listOfLecturers) {
  const dropdown = document.getElementById('lecturerDropDown')
  listOfLecturers.forEach(lecturer => {
    const lecturerOption = document.createElement('option')
    lecturerOption.text = lecturer
    dropdown.add(lecturerOption)
  })
}

function getFilterEvents(allEvents) {
  if (allEvents) {
    const lecturerDropDown = document.getElementById('lecturerDropDown')
    const selectedLecturerOption = lecturerDropDown.options[lecturerDropDown.selectedIndex].text
    console.log(selectedLecturerOption)
    if (selectedLecturerOption === 'All') {
      console.log(allEvents)
      return allEvents
    }

    const selectedEvents = []
    allEvents.forEach(event => {
      if (event.PersonName === selectedLecturerOption) {
        selectedEvents.push(event)
      }
    })
    return selectedEvents
  } else {
    alert('No events available yet.') // 'allEvents' is not available yet
  }
}

// Generate HTML table dynamically
function generateTableV2(events) {
  const table = document.createElement('table')
  table.id = 'openConsultationTable'
  table.classList.add('table', 'table-striped')

  const thead = document.createElement('thead')
  thead.classList.add('thead-dark')

  const tbody = document.createElement('tbody')

  // Create table header row
  const headerRow = document.createElement('tr')
  Object.keys(events[0]).forEach(key => {
    const th = document.createElement('th')
    th.textContent = key
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)

  // Create table body rows
  events.forEach(event => {
    const row = document.createElement('tr')
    Object.entries(event).forEach(([key, value]) => {
      const cell = document.createElement('td')

      if (key === 'EventDate') {
        const firstOccurrence = new Date(value)
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        const dateString = firstOccurrence.toLocaleDateString('en-US', options)

        cell.textContent = dateString
      } else {
        cell.textContent = value
      }

      row.appendChild(cell)
    })

    // Create a button element
    const buttonCell = document.createElement('td')
    const bookButton = document.createElement('button')
    bookButton.textContent = 'Book'
    bookButton.classList.add('btn', 'btn-primary')
    // Add event listener to the button
    bookButton.addEventListener('click', function () {
      bookEvent(event.EventId, event.EventDate)
    })
    buttonCell.appendChild(bookButton)
    row.appendChild(buttonCell)

    tbody.appendChild(row)
  })

  // Append thead and tbody to the table
  table.appendChild(thead)
  table.appendChild(tbody)

  return table
}
function sortEvents(events) {
  events[0].sort((a, b) => {
    const dateA = new Date(a.EventDate)
    const dateB = new Date(b.EventDate)

    // Compare the dates
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    // If the dates are the same, compare the times
    const timeA = new Date(`1970-01-01T${a.EventStartTime}`)
    const timeB = new Date(`1970-01-01T${b.EventStartTime}`)

    return timeA - timeB
  })
}

function getAllEvents () {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: '/events'
    })
      .done(function (res) {
        if (res.status === 'Valid') {
          // Access the events data from the response
          const events = res.events

          // Perform operations with the events data
          console.log(events)
          // Display or process the events data as needed

          // Display list of unique lecturers
          const lecturersUnique = generateLecturerOptions(events)
          generateHTMLLectuerOptions(lecturersUnique)

          // Sort events by which ones are closer
          sortEvents(events)

          // Get the container element to display the table
          const container = document.getElementById('tableContainer')

          // Generate the table and append it to the container
          container.appendChild(generateTable(events))
          resolve(events[0])
        } else {
          alert('Error retrieving events.')
          reject('Error retrieving events.') // Reject the promise with an error
        }
      })
      .fail(function () {
        console.error('Error retrieving events:(c)', error)
        alert('Error retrieving events.')
        reject('Error retrieving events.') // Reject the promise with an error
      })
  })
}

let allEvents

// Call the getAllEvents function to initiate the request
// Usage of getAllEvents() with promise
getAllEvents()
  .then(function (result) {
    console.log('Result:', result) // Handle the resolved value here
    allEvents = result
  })
  .catch(function (error) {
    console.error('Error:', error) // Handle the rejected error here
  })

function removeTable() {
  // Step 1: Get a reference to the table element
  const table = document.getElementById('openConsultationTable');

  // Step 2: Remove all existing rows from the table
  table.remove()
}
function generateFilteredEventTable() {
  removeTable()
  let filteredEvents = getFilterEvents(allEvents)
  // Get the container element to display the table
  const container = document.getElementById('tableContainer')
  // Generate the table and append it to the container
  container.appendChild(generateTableV2(filteredEvents))

}