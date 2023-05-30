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
async function bookEvent(EventId, EventDate) {
  const date = new Date(EventDate)
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
        .then(() => {
          generateFilteredEventTable()
        }
        )
    } else {
      alert('Error booking event.')
    }
  } catch (error) {
    console.error('Error booking event:', error)
    alert('Error booking event.')
  }
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

function addMultipleWeekEvents(events) {
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

function generateLecturerOptions(events) {
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

function generateHTMLLectuerOptions(listOfLecturers) {
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
function generateTable(events) {
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

async function getAllEvents() {
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
          events[0] = removePastEvents(events[0])

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

function removePastEvents(res) {
  const filteredEvents = []

  const currentDate = new Date() // Get the current date
  const currentTimeHour = parseInt(currentDate.toString().slice(15, 25)) // extract the time from the date
  const currentTimeMinute = parseInt(currentDate.toString().slice(19, 21))
  currentDate.setHours(2, 0, 0, 0) // set time to 02:00:00 so can compare with retrieved date

  for (let i = 0; i < res.length; i++) {
    const startDate = res[i].EventDate
    const actualDate = startDate
    const consultationDate = new Date(actualDate) // Convert the actualDate to a Date object

    const consultTimeHour = parseInt(res[i].EventStartTime)
    const consultTimeMinute = parseInt(res[i].EventStartTime.slice(3, 5))

    // Compare consultationDate and time with currentDate and time
    if (consultationDate > currentDate) {
      filteredEvents.push(res[i])
    } else if (currentDate.toString() === consultationDate.toString() && currentTimeHour < consultTimeHour) {
      filteredEvents.push(res[i])
    } else if (currentDate.toString() === consultationDate.toString() && currentTimeHour === consultTimeHour && currentTimeMinute < consultTimeMinute) {
      filteredEvents.push(res[i])
    }
  }
  return filteredEvents
}

function removeTable() {
  // Step 1: Get a reference to the table element
  const table = document.getElementById('openConsultationTable')

  // Step 2: Remove all existing rows from the table
  table.remove()
}

function filterAlreadyBookedConsultations(events, bookedConsulations) {
  function extractAttribute(arr, attributeName) {
    return arr.map(obj => obj[attributeName])
  }
  const bookedBookingIds = extractAttribute(bookedConsulations, 'eventId')

  function deleteAlreadyBookedEvents(events, bookedConsulationIds) {
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
function getAllConsults() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: './consults',
      success: function (res) {
        allConsultations = res
        if (res.length > 0) {
          processConsults(res)
          separatePastConsults(res)
        } else {
          const consultationList = document.getElementById('upcomingConsultations')
          consultationList.innerHTML = '<div class="no-consultations">No upcoming consultations</div>'
        }
        resolve()
      },
      error: function (xhr, status, error) {
        reject(error)
      }
    })
  })
}

getAllConsults()

// sort consults to display in order of time
function processConsults(res) {
  // Sort the events by date and time
  res.sort(function (a, b) {
    const dateA = new Date(a.StartDate)
    const dateB = new Date(b.StartDate)

    // If the dates are equal, compare the start times
    if (dateA.getTime() === dateB.getTime()) {
      const timeA = new Date(`1970-01-01T${a.StartTime}`)
      const timeB = new Date(`1970-01-01T${b.StartTime}`)
      return timeA - timeB
    }
    return dateA - dateB
  })
}

function separatePastConsults(res) {
  const currentDate = new Date() // Get the current date
  const currentTimeHour = parseInt(currentDate.toString().slice(15, 25)) // extract the time from the date
  const currentTimeMinute = parseInt(currentDate.toString().slice(19, 21))
  currentDate.setHours(2, 0, 0, 0) // set time to 02:00:00 so can compare with retrieved date

  for (let i = 0; i < res.length; i++) {
    const startDate = res[i].StartDate
    const actualDate = startDate
    const consultationDate = new Date(actualDate) // Convert the actualDate to a Date object

    const truncatedDateConsult = consultationDate.toString().slice(0, 15) // Remove the time from the date
    const consultTimeHour = parseInt(res[i].StartTime)
    const consultTimeMinute = parseInt(res[i].StartTime.slice(3, 5))

    let daysUntilConsultation = Math.ceil((consultationDate - currentDate) / (1000 * 3600 * 24)) // Calculate the number of days until the consultation

    let flag = false

    // Compare consultationDate and time with currentDate and time
    if (consultationDate > currentDate) {
      flag = true
    } else if (currentDate.toString() === consultationDate.toString() && currentTimeHour < consultTimeHour) {
      daysUntilConsultation = 'Your consultation is today. Please be on time.'
      flag = true
    } else if (currentDate.toString() === consultationDate.toString() && currentTimeHour === consultTimeHour && currentTimeMinute < consultTimeMinute) {
      daysUntilConsultation = 'Your consultation is today. Please be on time.'
      flag = true
    }
    if (flag === true) { // If the consultationDate is after the currentDate, display the consultation
      showConsultation(false,
        res[i].lecturerName,
        truncatedDateConsult,
        res[i].StartTime,
        res[i].Duration,
        daysUntilConsultation,
        res[i].bookingId,
        res[i].Description
      )
    } else { // display consultation in past consultations tab
      showConsultation(true,
        res[i].lecturerName,
        truncatedDateConsult,
        res[i].StartTime,
        res[i].Duration,
        0,
        0,
        res[i].Description
      )
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const upcomingTab = document.getElementById('upcomingTab')
  const pastTab = document.getElementById('pastTab')
  const upcomingConsultations = document.getElementById('upcoming')
  const pastConsultations = document.getElementById('past')

  // Add click event listeners to the tabs
  upcomingTab.addEventListener('click', function () {
    // Show the upcoming consultations tab and hide the past consultations tab
    upcomingTab.classList.add('active')
    pastTab.classList.remove('active')
    upcomingConsultations.classList.add('show')
    upcomingConsultations.classList.add('active')
    pastConsultations.classList.remove('show')
    pastConsultations.classList.remove('active')
  })

  pastTab.addEventListener('click', function () {
    // Show the past consultations tab and hide the upcoming consultations tab
    pastTab.classList.add('active')
    upcomingTab.classList.remove('active')
    pastConsultations.classList.add('show')
    pastConsultations.classList.add('active')
    upcomingConsultations.classList.remove('show')
    upcomingConsultations.classList.remove('active')
  })
})

function generateFilteredEventTable() {
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

function showConsultation(isPast, name, date, time, duration, daysUntil, bookingId, description) {
  // Create a new list item for the consultation
  const consultationItem = document.createElement('li')
  consultationItem.classList.add('list-group-item', 'mb-3')

  // Check if it's an alternate consultation item
  const isAlternate = document.querySelectorAll('.list-group-item').length % 2 === 0
  if (isAlternate) {
    consultationItem.classList.add('alternate') // Add 'alternate' class to alternate items
  }

  // Create a table for the consultation details
  const table = document.createElement('table')
  table.classList.add('table')

  // Create table rows for each detail
  const rows = [
    { label: 'Lecturer:', value: name },
    { label: 'Date:', value: date },
    { label: 'Start Time:', value: time },
    { label: 'Duration (minutes):', value: duration },
    { label: 'Description:', value: description }
  ]

  // Add "Days Until Consultation" row for upcoming consultations
  if (!isPast) {
    rows.push({ label: 'Days Until Consultation:', value: daysUntil })
  }
  rows.forEach((row) => {
    const tr = document.createElement('tr')

    const labelTd = document.createElement('td')
    const labelStrong = document.createElement('strong')
    labelStrong.textContent = row.label
    labelTd.appendChild(labelStrong)

    const valueTd = document.createElement('td')
    valueTd.classList.add('text-start', 'pe-3') // Align value to the left with right padding
    valueTd.style.width = '40%' // Set a relative width for the value column
    valueTd.textContent = row.value

    tr.appendChild(labelTd)
    tr.appendChild(valueTd)
    table.appendChild(tr)
  })

  // Create a row for the cancel button (only for upcoming consultations)
  if (!isPast) {
    const cancelButtonRow = document.createElement('tr')

    const cancelButtonCell = document.createElement('td')
    cancelButtonCell.setAttribute('colspan', '2')
    cancelButtonCell.classList.add('text-end') // Align button to the right

    const cancelButton = document.createElement('button')
    cancelButton.classList.add('btn', 'btn-danger')
    cancelButton.textContent = 'Cancel'

    // Add cancel button click event handler
    cancelButton.addEventListener('click', function () {
      // This function will be called when the cancel button is clicked
      deleteAllConsultations()
      deleteConsult(bookingId)
    })

    cancelButtonCell.appendChild(cancelButton)
    cancelButtonRow.appendChild(cancelButtonCell)
    table.appendChild(cancelButtonRow)
  }

  // Append the table to the consultation item
  consultationItem.appendChild(table)

  // Append the consultation item to the appropriate container
  const consultationList = isPast ? document.getElementById('pastConsultations') : document.getElementById('upcomingConsultations')
  consultationList.appendChild(consultationItem)
}

function deleteConsult(id) {
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

function deleteAllConsultations() {
  const consultationList = document.getElementById('upcomingConsultations')
  while (consultationList.firstChild) {
    consultationList.firstChild.remove()
  }
}
