document.getElementById("save-chages").addEventListener('click', () => {

  // Get form values
  let startDate = new Date(document.getElementById('day-of-month').value)

  //NEED TO ADD ERROR HANDLING OR PRESET TO NO
  const recurringOption = document.querySelector('input[name="recurring"]:checked').value

  let recurringOptionBinary = 0
  if (recurringOption === 'yes') {
    recurringOptionBinary = 1
  }

  const startTime = document.getElementById('start-time').value
  const endTime = document.getElementById('end-time').value
  const maxConsultStudents = document.getElementById('max-consults-students').value
  let recurringWeeks = document.getElementById('num-weeks-recurring').value
  const description = document.getElementById('description').value

 

  //Create nonsense dates on the same day with the start and end times to allow for the duration calculation
  //Gives duration in minutes
  const duration = (new Date('1970/01/01 ' + endTime) - new Date('1970/01/01 ' + startTime)) / 60000
  


  // Validate required fields
  if (!startDate || !startTime || !endTime || !maxConsultStudents || !recurringOption) {
    alert('Please fill in all the required fields.')
    return
  }

  let consultationSummaryString = 'Consulatation Date: ' + startDate.toString().substr(0, 15) + "<br />" + 'Starting Time: ' + startTime + "<br />"
    + 'Ending Time: ' + endTime + "<br />" + 'Duration: ' + duration + ' mins' + "<br />" + 'Max Students: ' + maxConsultStudents + "<br />" + 'Recurring: '

  if (recurringOption === 'yes') {
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (7 * recurringWeeks))

    consultationSummaryString += 'Yes' + "<br />" + 'Number of recurring weeks: ' + recurringWeeks + "<br />" +
      'Effective end date: ' + endDate.toString().substr(0, 15)
  }
  else {
    recurringWeeks = 0
    endDate = new Date(startDate)
    consultationSummaryString += 'No'
  }

  if (description != '') {
    consultationSummaryString += "<br />" + 'Description: ' + description
  }
  

  $('#consultationSummary').modal('show');
  document.getElementById('consultationSummaryModalBody').innerHTML = (consultationSummaryString)

  //get day of week to store in database
  const dow = startDate.toString().substring(0,3)
  //console.log(dow)

 startDate = startDate.toISOString().split('T')[0]
 endDate = endDate.toISOString().split('T')[0]

  //Create consulation button sends request with data to insert
  document.getElementById('create-consultation').addEventListener('click', () => {
    //console.log('Created consultation')

    // Prepare the data payload
    const data = {
      startDate,
      endDate,
      startTime,
      endTime,
      duration,
      dow,
      recurringWeeks,
      maxConsultStudents,
      description
    }

    $.ajax({
      type: 'POST',
      contentType: 'application/json', // header property of http request, which tells the server what type of data to
      // expect in the BODY of the POST message (standard is plaintext)
      data: JSON.stringify({dow, startDate, endDate, startTime, endTime, duration,  recurringWeeks, maxConsultStudents, description }), // data sent (converted to JSON)
      url: './dashboard' // URL that the POST is sent to
    }).done(function (res) {
      if (res.status === 'Valid') {
        window.location.href = res.href
      } else {
        console.log('Invalid input')
      }
    })
  })

})


// Dynamically show the date selection based on repeats

let displayType = 'none'

let numWeeksToRecur = document.getElementById('weeks-recurring')
numWeeksToRecur.style.display = displayType


document.getElementById('recurring-yes').addEventListener('click', () => {
  displayType = ''
  numWeeksToRecur.style.display = displayType
  //console.log('Yes')
})

document.getElementById('recurring-no').addEventListener('click', () => {
  displayType = 'none'
  numWeeksToRecur.style.display = displayType
})

