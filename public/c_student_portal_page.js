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

// Generate HTML table dynamically
function generateTable (events) {
  const table = document.createElement('table')
  const thead = document.createElement('thead')
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
      if (typeof value === 'object') {
        cell.textContent = value.data[0]
      } else {
        cell.textContent = value
      }

      row.appendChild(cell)
    })
    tbody.appendChild(row)
  })

  // Append thead and tbody to the table
  table.appendChild(thead)
  table.appendChild(tbody)

  return table
}

$(document).ready(function () {
  // Function to retrieve all events from the server
  function getAllEvents () {
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

          // Get the container element to display the table
          const container = document.getElementById('tableContainer')

          // Generate the table and append it to the container
          container.appendChild(generateTable(events))
        } else {
          alert('Error retrieving events.')
        }
      })
      .fail(function () {
        console.error('Error retrieving events:(c)', error)
        alert('Error retrieving events.')
      })
  }

  // Call the getAllEvents function to initiate the request
  getAllEvents()
})

// function getAllEvents () {
//   // Event list retrieval process
//   console.log('Hello from befor ajax')
//   $(document).ready(function () {
//     // Event list retrieval process
//     $.ajax({
//       type: 'POST',
//       data: JSON.stringify({ userName: 'mik', password: '12345' }),
//       url: './events'
//     }).done(function (res) {
//       if (res.status === 'Valid') {
//         window.location.href = res.href
//       } else {
//         alert('Invalid login')
//       }
//     })
//   })
// }

// // Call the getAllEvents function to initiate the request
// getAllEvents()
