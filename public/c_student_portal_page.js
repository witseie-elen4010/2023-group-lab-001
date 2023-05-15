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
