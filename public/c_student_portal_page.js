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
  const date = new Date(EventDate)
  date.setDate(date.getDate() + 1)
  const formattedDate = date.toISOString().split('T')[0]
  // console.log(formattedDate)

  const bookingData = {
    eventId: EventId,
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
      alert('Event booked successfully:\n' + 'Date: ' + bookingData.Date + '\nEvent Id: ' + bookingData.eventId)
      deleteAllConsultations()
      getAllConsults()
    } else {
      alert('Error booking event.')
    }
  } catch (error) {
    console.error('Error booking event:', error)
    alert('Error booking event.')
  }
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

function addMultipleWeekEvents (events) {
  const newEvents = [] // Separate array to hold newly generated events

  for (let i = 0; i < events[0].length; i++) {
    const currentEvent = events[0][i]
    const startDate = new Date(currentEvent.EventDate)
    const tempDate = new Date(currentEvent.EventDate)

    for (let weekNumber = 1; weekNumber < currentEvent.NumberOfWeeks + 1; weekNumber++) {
      tempDate.setDate(startDate.getDate() + 7 * weekNumber)
      const tempCurrentEvent = Object.assign({}, currentEvent) // Create a shallow copy
      tempCurrentEvent.EventDate = tempDate.toISOString()
      newEvents.push(tempCurrentEvent) // Add new events to separate array
    }
  }

  events[0] = events[0].concat(newEvents) // Append new events to the original events array
  return events
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

function getFilterEvents (allEvents) {
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
function generateTable (events) {
  const table = document.createElement('table')
  table.id = 'openConsultationTable'
  table.classList.add('table', 'table-striped')

  const thead = document.createElement('thead')
  thead.style.backgroundColor = '#fff'
  thead.style.color = '#000'
  // thead.classList.add('thead-dark')

  const tbody = document.createElement('tbody')

  const keyToTitleName = {
    PersonName: 'Lecturer:',
    EventDescription: 'Description:',
    EventStartTime: 'Time',
    EventDate: 'Date',
    EventDuration: 'Duration of consultation'
  }
  const wantedKeys = Object.keys(keyToTitleName)

  // Create table header row
  const headerRow = document.createElement('tr')
  Object.keys(events[0]).forEach(key => {
    if (wantedKeys.includes(key)) {
      const th = document.createElement('th')
      th.textContent = keyToTitleName[key]
      headerRow.appendChild(th)
    }
  })
  thead.appendChild(headerRow)

  // Create table body rows
  events.forEach(event => {
    const row = document.createElement('tr')
    Object.entries(event).forEach(([key, value]) => {
      if (wantedKeys.includes(key)) {
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
      }
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

function getAllEvents () {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: '/events'
    })
      .done(function (res) {
        if (res.status === 'Valid') {
          // Access the events data from the response
          let events = res.events

          // Perform operations with the events data
          // Display or process the events data as needed

          // Display list of unique lecturers
          const lecturersUnique = generateLecturerOptions(events)
          generateHTMLLectuerOptions(lecturersUnique)

          events = addMultipleWeekEvents(events)

          // Sort events by which ones are closer
          sortEvents(events)

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

function removeTable () {
  // Step 1: Get a reference to the table element
  const table = document.getElementById('openConsultationTable')

  // Step 2: Remove all existing rows from the table
  table.remove()
}

function filterAlreadyBookedConsultations (events, bookedConsulations) {
  function extractAttribute (arr, attributeName) {
    return arr.map(obj => obj[attributeName])
  }
  const bookedBookingIds = extractAttribute(bookedConsulations, 'eventId')

  function deleteAlreadyBookedEvents (events, bookedConsulationIds) {
    const filteredEvents = []
    for (let i = 0; i < events.length; i++) {
      if (!(bookedConsulationIds.includes(events[i].EventId))) {
        filteredEvents.push(events[i])
      }
    }
    return filteredEvents
  }
  return deleteAlreadyBookedEvents(events, bookedBookingIds)
}

let allConsultations
function getAllConsults () {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: './consults'
  }).done(function (res) {
    allConsultations = res
    const currentDate = new Date() // Get the current date
    for (let i = 0; i < res.length; i++) {
      const startDate = res[i].StartDate
      const actualDate = startDate.substr(0, startDate.indexOf('T'))

      const consultationDate = new Date(actualDate) // Convert the actualDate to a Date object
      const daysUntilConsultation = Math.ceil((consultationDate - currentDate) / (1000 * 60 * 60 * 24)) // Calculate the number of days until the consultation

      showConsultation(res[i].lecturerName, actualDate, res[i].StartTime, daysUntilConsultation, res[i].bookingId)
    }
  })
}

getAllConsults()

function generateFilteredEventTable () {
  try {
    removeTable()
  } catch (error) {
    // console.log('Error with removing booking consultation table: ')
    // console.log(error)
  }
  const availableEvents = filterAlreadyBookedConsultations(allEvents, allConsultations)
  const filteredEvents = getFilterEvents(availableEvents)

  if (filteredEvents.length !== 0) {
    // Get the container element to display the table
    const container = document.getElementById('tableContainer')
    // Generate the table and append it to the container
    container.appendChild(generateTable(filteredEvents))
  }
}

// Call the getAllEvents function to initiate the request
// Usage of getAllEvents() with promise
getAllEvents()
  .then(function (result) {
    allEvents = result
  })
  .then(function () {
    const container = document.getElementById('tableContainer')
    const unbookedEvents = filterAlreadyBookedConsultations(allEvents, allConsultations)
    container.appendChild(generateTable(unbookedEvents))
  })
  .catch(function (error) {
    console.error('Error:', error) // Handle the rejected error here
  })

function showConsultation (name, date, time, daysUntil, bookingId) {
  // Create a new list item for the consultation
  const consultationItem = document.createElement('li')
  consultationItem.classList.add('list-group-item')

  // Create the row divs for name, date, time, days until, and cancel button
  const rowDiv = document.createElement('div')
  rowDiv.classList.add('row')

  const detailsDiv = document.createElement('div')
  detailsDiv.classList.add('col-md-6')

  const nameHeading = document.createElement('h5')
  nameHeading.textContent = 'Lecturer:'
  detailsDiv.appendChild(nameHeading)

  const nameDiv = document.createElement('div')
  nameDiv.textContent = name
  detailsDiv.appendChild(nameDiv)

  const dateHeading = document.createElement('h5')
  dateHeading.textContent = 'Date: '
  detailsDiv.appendChild(dateHeading)

  const dateDiv = document.createElement('div')
  dateDiv.textContent = date
  detailsDiv.appendChild(dateDiv)

  const timeHeading = document.createElement('h5')
  timeHeading.textContent = 'Time: '
  detailsDiv.appendChild(timeHeading)

  const timeDiv = document.createElement('div')
  timeDiv.textContent = time
  detailsDiv.appendChild(timeDiv)

  const daysUntilDiv = document.createElement('div')
  daysUntilDiv.classList.add('col-md-2')

  const daysUntilHeading = document.createElement('h5')
  daysUntilHeading.textContent = 'Days Until Consultation:'
  daysUntilDiv.appendChild(daysUntilHeading)

  const daysUntilSpan = document.createElement('span')
  daysUntilSpan.classList.add('days-until')
  daysUntilSpan.textContent = daysUntil // Set the daysUntil value as the content of the span element

  const bookingIdDiv = document.createElement('div')
  bookingIdDiv.classList.add('col-md-1')

  const bookingIdHeading = document.createElement('h5')
  bookingIdHeading.textContent = 'Booking ID:'
  bookingIdDiv.appendChild(bookingIdHeading)

  const bookingIdSpan = document.createElement('span')
  bookingIdSpan.textContent = bookingId // Set the bookingId value as the content of the span element

  const cancelDiv = document.createElement('div')
  cancelDiv.classList.add('col-md-3', 'text-right')

  const cancelButton = document.createElement('button')
  cancelButton.classList.add('btn', 'btn-danger')
  cancelButton.textContent = 'Cancel'

  // Add cancel button click event handler
  cancelButton.addEventListener('click', function () {
    // This function will be called when the cancel button is clicked
    deleteAllConsultations()
    deleteConsult(bookingId)
  })

  // Append elements to their respective parent elements
  cancelDiv.appendChild(cancelButton)
  rowDiv.appendChild(detailsDiv)
  rowDiv.appendChild(daysUntilDiv)
  rowDiv.appendChild(bookingIdDiv)
  rowDiv.appendChild(cancelDiv)
  consultationItem.appendChild(rowDiv)
  daysUntilDiv.appendChild(daysUntilSpan)
  bookingIdDiv.appendChild(bookingIdSpan)

  // Append the consultation item to the consultation list
  const consultationList = document.getElementById('upcomingConsultations')
  consultationList.appendChild(consultationItem)
}

function deleteConsult (id) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ bookingID: id }),
    url: './studentDeleteBooking' // URL that the POST is sent to
  }).done(function (res) {
    if (res.status === 'Completed') {
      alert(`Booking: "${id}" has been deleted`)
      getAllConsults()
    }
  })
}

function deleteAllConsultations () {
  const consultationList = document.getElementById('upcomingConsultations')
  while (consultationList.firstChild) {
    consultationList.firstChild.remove()
  }
}
