// Add event listener to the form submit button
document.getElementById('availability-form').addEventListener('submit', handleSubmit)

function handleSubmit (event) {
  event.preventDefault() // Prevent form from submitting
  // Get form values
  const dayOfMonth = document.getElementById('day-of-month').value
  const recurringOption = document.querySelector('input[name="recurring"]:checked').value
  let endDate = dayOfMonth
  let recurringOptionBinary = 0
  if (recurringOption === 'yes') {
    endDate = document.getElementById('end-date').value
    recurringOptionBinary = 1
  }
  const startTime = document.getElementById('start-time').value
  const endTime = document.getElementById('end-time').value
  const maxConsultsDay = document.getElementById('max-consults-day').value
  const maxConsultsStudents = document.getElementById('max-consults-students').value
  const description = document.getElementById('description').value

  // Validate required fields
  if (!dayOfMonth || !startTime || !endTime || !maxConsultsDay || !maxConsultsStudents || !recurringOption) {
    alert('Please fill in all the required fields.')
    return
  }

  // Prepare the data payload
  const data = {
    dayOfMonth,
    startTime,
    recurringOptionBinary,
    endDate,
    endTime,
    maxConsultsDay,
    maxConsultsStudents,
    description
  }

  $.ajax({
    type: 'POST',
    contentType: 'application/json', // header property of http request, which tells the server what type of data to
    // expect in the BODY of the POST message (standard is plaintext)
    data: JSON.stringify({ dayOfMonth, startTime, recurringOptionBinary, endDate, endTime, maxConsultsDay, maxConsultsStudents, description }), // data sent (converted to JSON)
    url: './dashboard' // URL that the POST is sent to
  }).done(function (res) {
    if (res.status === 'Valid') {
      window.location.href = res.href
    } else {
      console.log('Invalid input')
    }
  })
};
