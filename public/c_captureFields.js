
function loadBookings() {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: './lecturerUpcomingConsultations' // URL that the POST is sent to
  }).done(function (res) {
    populateUpcoming(res)
  })
}

loadBookings()

// populate upcoming consultations section
function populateUpcoming(consultations) {
  const content = []
  for (let i = 0; i < consultations.length; i++) {
    content.push(createUpcomingEntry(consultations[i]))
  }
  $('#upcomingBookingsList').html(content.join(''))
}

function createUpcomingEntry(consultation) {
  const content = []

  const consultationDate = new Date(consultation.Date) // Convert the consultation date to a Date object


  content.push('<li class="list-group-item">')
  content.push('<div class="row">')
  content.push(`<div class="col-md-2 font-weight-bold">${consultation.studentName}</div>`)
  content.push(`<div class="col-md-3">${consultation.Description}</div>`)
  content.push(`<div class="col-md-3">${new Date(consultation.Date).toISOString().split('T')[0]} @ ${consultation.StartTime}</div>`)
  content.push(`<div class="col-md-2">${consultation.Duration} mins</div>`)
  content.push(`<div class="col-md-2"><button class="btn btn-danger" onclick="deleteBooking(${consultation.Id})">Delete</button></div>`)
  content.push('</div></li>')
  return content.join('')
}

function deleteBooking(id) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ bookingID: id }),
    url: './lecDeleteBooking' // URL that the POST is sent to
  }).done(function (res) {
    if (res.status === 'Completed') {
      alert(`Booking: "${id}" has been deleted`)
      loadBookings()
    }
  })
}

//Code to fetch and show all of the consultations the lecturer has created:

function loadConsultations() {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: './lecturerAllConsultations' // URL that the POST is sent to
  }).done(function (res) {
    console.log(res)
    populateUpcomingConsultations(res)
  })
}

loadConsultations()

function populateUpcomingConsultations(consultations) {
  const content = []
  for (let i = 0; i < consultations.length; i++) {
    content.push(createConsulationEntry(consultations[i]))
  }
  $('#allConsultationsList').html(content.join(''))
}

function createConsulationEntry(event) {
  const content = []
  
  const eventDate = new Date(event.StartDate)
  
  content.push('<li class="list-group-item">')
  content.push('<div class="row">')
  content.push(`<div class="col-md-3 font-weight-bold">${event.Description}</div>`)
  content.push(`<div class="col-md-2 font-weight-bold">${event.SlotsPerDay}</div>`)
  content.push(`<div class="col-md-3">${eventDate.toISOString().split('T')[0]} @ ${event.StartTime}</div>`)
  content.push(`<div class="col-md-2">${event.Duration} mins</div>`)
  content.push(`<div class="col-md-2"><button class="btn btn-danger" onclick="deleteEvent(${event.Id})">Delete</button></div>`)
  content.push('</div></li>')
  return content.join('')
}

function deleteEvent(id) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ bookingID: id }),
    url: './lecDeleteEvent' // URL that the POST is sent to
  }).done(function (res) {
    if (res.status === 'Completed') {
      alert(`Consultation: "${id}" has been deleted`)
      loadBookings()
    }
  })
}


document.getElementById('save-chages').addEventListener('click', previewConsultation)
let createConsultation = null
function previewConsultation() {
  // Get form values
  const startDate = new Date(document.getElementById('day-of-month').value)

  // Make sure a lecturer can't create a consultation on a day which has already passed.
  const currentDate = new Date()
  console.log('Start Date:' + startDate.toISOString().substring(0, 10))
  console.log('Current Date:' + currentDate.toISOString().substring(0, 10))

  if (startDate.toISOString().substring(0, 10) < currentDate.toISOString().substring(0, 10)) {
    alert('This date has already passed. Please reselect consultation date')
    return
  }

  // NEED TO ADD ERROR HANDLING OR PRESET TO NO
  const recurringOption = document.querySelector('input[name="recurring"]:checked').value

  let recurringOptionBinary = 0
  if (recurringOption === 'yes') {
    recurringOptionBinary = 1
  }

  const startTime = document.getElementById('start-time').value
  const endTime = document.getElementById('end-time').value
  
  const startTicks = new Date(startDate.toISOString().substring(0, 10) + ' ' + startTime).getTime()
  const endTicks = new Date(startDate.toISOString().substring(0, 10) + ' ' + endTime).getTime()

    // Check end time is valid:
  if (new Date('1970/01/01 ' + endTime) < new Date('1970/01/01 ' + startTime)) {
    alert('Cannot end a consultation before it starts. \nPlease reselect end time')
    return
  } else if ((new Date('1970/01/01 ' + endTime)).toISOString() == (new Date('1970/01/01 ' + startTime)).toISOString()) {
    alert('Cannot end a consultation at the same time as it starts. \nPlease reselect end time')

    return
  }

 
  

  const maxConsultStudents = document.getElementById('max-consults-students').value
  let recurringWeeks = document.getElementById('num-weeks-recurring').value
  const description = document.getElementById('description').value

  // Create nonsense dates on the same day with the start and end times to allow for the duration calculation
  // Gives duration in minutes
  const duration = (new Date('1970/01/01 ' + endTime) - new Date('1970/01/01 ' + startTime)) / 60000

  // Validate required fields
  if (!startDate || !startTime || !endTime || !maxConsultStudents || !recurringOption) {
    alert('Please fill in all the required fields.')
    return
  }

  let consultationSummaryString = 'Consulatation Date: ' + startDate.toString().substr(0, 15) + '<br />' + 'Starting Time: ' + startTime + '<br />' +
    'Ending Time: ' + endTime + '<br />' + 'Duration: ' + duration + ' mins' + '<br />' + 'Max Students: ' + maxConsultStudents + '<br />' + 'Recurring: '

  if (recurringOption === 'yes') {
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (7 * recurringWeeks))

    consultationSummaryString += 'Yes' + '<br />' + 'Number of recurring weeks: ' + recurringWeeks + '<br />' +
      'Effective end date: ' + endDate.toString().substr(0, 15)
  } else {
    recurringWeeks = 1
    endDate = new Date(startDate)
    consultationSummaryString += 'No'
  }

  if (description != '') {
    consultationSummaryString += '<br />' + 'Description: ' + description
  }


  document.getElementById('consultationSummaryModalBody').innerHTML = (consultationSummaryString)

   //Check consultation doesn't overlap with existing consultations
   $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: './lecturerAllConsultations' // URL that the POST is sent to
  }).done(function (res) {
    let conflict = false;
    for (let i = 0; i < res.length; i++)
    {
      const eStartTicks = new Date (res[i].StartDate + ' ' + res[i].StartTime).getTime()
      const eEndTicks = new Date (res[i].EndDate + ' ' + res[i].EndTime).getTime()
      if((eStartTicks <= endTicks) && (eEndTicks >= startTicks))
      {
        
        alert(`Cannot create consultation - consultation: ${res[i].Description} has a conflicting time`)
        conflict = true
        return
      }
    }
    if(!conflict)
    {
      $('#consultationSummary').modal('show')
      return
    }
  })

  
  

  // get day of week to store in database
  const dow = startDate.toString().substring(0, 3)
  // console.log(dow)

  formattedStartDate = startDate.toISOString().split('T')[0]
  endDate = endDate.toISOString().split('T')[0]
  if (createConsultation != null) document.getElementById('create-consultation').removeEventListener('click', createConsultation)
  createConsultation = function () {
    recurringWeeksSet = 0
    console.log('Recurring Weeks: ' + (Number(recurringWeeks)))

    for (let i = 0; i < Number(recurringWeeks); i++) {
      tempStartDate = new Date(startDate)
      tempStartDate.setDate(tempStartDate.getDate() + (i * 7))
      formattedStartDate = tempStartDate.toISOString().split('T')[0]
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + (i * 7))
      endDate = endDate.toISOString().split('T')[0]
      console.log(i)

      $.ajax({
        type: 'POST',
        contentType: 'application/json', // header property of http request, which tells the server what type of data to
        // expect in the BODY of the POST message (standard is plaintext)
        data: JSON.stringify({ dow, formattedStartDate, endDate, startTime, endTime, duration, recurringWeeksSet, maxConsultStudents, description }), // data sent (converted to JSON)
        url: './dashboard' // URL that the POST is sent to
      }).done(function (res) {
        console.log('DONE')
        $('#consultationSummary').modal('hide')
      })
    }

    loadConsultations()
    alert(`Consultation: ${description} created!`)
  }

  // Create consulation button sends request with data to insert
  // if (sem === 0 ) {

  document.getElementById('create-consultation').addEventListener('click', createConsultation)
  // }
  // sem = 1;
}

// Dynamically show the date selection based on repeats

let displayType = 'none'

const numWeeksToRecur = document.getElementById('weeks-recurring')
numWeeksToRecur.style.display = displayType

document.getElementById('recurring-yes').addEventListener('click', () => {
  displayType = ''
  numWeeksToRecur.style.display = displayType
})

document.getElementById('recurring-no').addEventListener('click', () => {
  displayType = 'none'
  numWeeksToRecur.style.display = displayType
})
