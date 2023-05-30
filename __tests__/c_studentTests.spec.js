'use strict'

const {
  sortEvents,
  generateLecturerOptions,
  generateHTMLLectuerOptions,
  getFilterEvents,
  generateTable,
  redirectToGoogleCalendar,
  filterAlreadyBookedConsultations
} = require('../public/c_student_portal_page.js')
const { JSDOM } = require('jsdom')

describe('Client-side JavaScript Functions', () => {
  const currentDate = '2023-05-28'

  // Define the testEvents variable
  const testEvents = [[
    {
      PersonName: 'Asher Radowsky',
      NumberOfWeeks: 0,
      EventDescription: 'In past',
      EventStartTime: '10:52:00',
      EventDate: '2023-05-17',
      EventDuration: 60,
      SlotsPerDay: 2,
      EventId: 328,
      EventBookingCount: 0
    },
    {
      PersonName: 'Asher Radowsky',
      NumberOfWeeks: 0,
      EventDescription: 'In present',
      EventStartTime: '10:54:00',
      EventDate: '2023-05-18',
      EventDuration: 60,
      SlotsPerDay: 1,
      EventId: 330,
      EventBookingCount: 0
    },
    {
      PersonName: 'Asher Radowsky',
      NumberOfWeeks: 0,
      EventDescription: 'In future',
      EventStartTime: '10:55:00',
      EventDate: '2023-05-19',
      EventDuration: 60,
      SlotsPerDay: 1,
      EventId: 331,
      EventBookingCount: 0
    },
    {
      PersonName: 'Lecturer Testing',
      NumberOfWeeks: 0,
      EventDescription: 'In past',
      EventStartTime: '14:00:00',
      EventDate: '2023-05-16',
      EventDuration: 60,
      SlotsPerDay: 2,
      EventId: 383,
      EventBookingCount: 1
    },
    {
      PersonName: 'Lecturer Testing',
      NumberOfWeeks: 0,
      EventDescription: 'In present',
      EventStartTime: '14:00:00',
      EventDate: '2023-05-18',
      EventDuration: 60,
      SlotsPerDay: 2,
      EventId: 380,
      EventBookingCount: 1
    },
    {
      PersonName: 'Lecturer Testing',
      NumberOfWeeks: 0,
      EventDescription: 'In future',
      EventStartTime: '14:00:00',
      EventDate: '2023-05-20',
      EventDuration: 60,
      SlotsPerDay: 2,
      EventId: 381,
      EventBookingCount: 0
    },
    {
      PersonName: 'Steve Levitt',
      NumberOfWeeks: 0,
      EventDescription: 'In past',
      EventStartTime: '05:59:00',
      EventDate: '2023-05-15',
      EventDuration: 6,
      SlotsPerDay: 5,
      EventId: 356,
      EventBookingCount: 0
    },
    {
      PersonName: 'Steve Levitt',
      NumberOfWeeks: 0,
      EventDescription: 'In present',
      EventStartTime: '11:00:00',
      EventDate: '2023-05-18',
      EventDuration: 120,
      SlotsPerDay: 1,
      EventId: 364,
      EventBookingCount: 0
    },
    {
      PersonName: 'Steve Levitt',
      NumberOfWeeks: 0,
      EventDescription: 'In future',
      EventStartTime: '11:00:00',
      EventDate: '2023-05-21',
      EventDuration: 120,
      SlotsPerDay: 1,
      EventId: 366,
      EventBookingCount: 0
    }
  ],
  {
    Random: 'Hello World'
  }
  ]

  // Test the sortEvents function
  describe('sortEvents', () => {
    it('should sort events by date and time', () => {
      // Call the function
      sortEvents(testEvents)
      const tempEvents = events[0]

      const descriptions = tempEvents.map(obj => obj[EventDescription])

      expect(descriptions[0] === descriptions[1] === descriptions[2] === 'In past')
      expect(descriptions[3] === descriptions[4] === descriptions[5] === 'In present')
      expect(descriptions[6] === descriptions[7] === descriptions[8] === 'In future')
    })
  })

  // Test the generateLecturerOptions function
  describe('generateLecturerOptions', () => {
    it('should generate a list of unique lecturers from events', () => {
      function areSetsEqual (set1, set2) {
        if (set1.size !== set2.size) {
          return false
        }

        for (const value of set1) {
          if (!set2.has(value)) {
            return false
          }
        }

        return true
      }

      // Call the function
      const result = generateLecturerOptions(testEvents)
      const expectedResult = new Set('Asher Radowsky', 'Lecturer Testing', 'Steve Levitt')

      expect(areSetsEqual(result, expectedResult))
    })
  })

  //     // Test the generateHTMLLectuerOptions function
  // describe('generateHTMLLectuerOptions', () => {
  //     it('should generate HTML options for lecturers', () => {
  //         // Set up the test data
  //         const lecturers = ['John Doe', 'Jane Smith'];

  //         // Call the function
  //         const result = generateHTMLLectuerOptions(lecturers);

  //         // Assert the expected behavior
  //         // ... assert that the HTML options are generated correctly
  //     });
  // });

  describe('getFilterEvents', () => {
    // Set up the mock HTML environment
    const dom = new JSDOM(`<!DOCTYPE html><div class="container">
                                    <h2>Select an option:</h2>
                                    <select id="lecturerDropDown" onchange="generateFilteredEventTable()" class="form-control">
                                        <option>All</option>
                                        <!-- Options will be dynamically generated -->
                                    </select>
                                </div>`)
    global.document = dom.window.document

    it('should update the filter events based on user input', () => {
      // Arrange: Create the necessary DOM elements and set up event listeners
      const lecturerDropDown = document.getElementById('lecturerDropDown')

      // Create the options and set the desired option as selected
      const option1 = document.createElement('option')
      option1.value = 'option1'
      option1.text = 'Asher Radowsky'
      lecturerDropDown.appendChild(option1)

      const option2 = document.createElement('option')
      option2.value = 'option2'
      option2.text = 'Lecturer Testing'
      // Set option2 as selected
      option2.selected = true
      lecturerDropDown.appendChild(option2)

      const option3 = document.createElement('option')
      option3.value = 'option3'
      option3.text = 'Steve Levitt'
      lecturerDropDown.appendChild(option3)

      // Act: Trigger the event that should invoke the generateFilteredEventTable function
      const event = new Event('change')
      lecturerDropDown.dispatchEvent(event)

      // Assert: Verify the result of the getFilterEvents function
      const filteredEvents = getFilterEvents(testEvents[0])
      const lecturersOfFilteredEvents = filteredEvents.every(obj => obj.PersonName === 'Lecturer Testing')
      expect(areAllPersonNamesEqual).toBe(true)
    })

    // Clean up the mock HTML environment after all tests have run
    afterAll(() => {
      delete global.document
    })
  })

  // Test the generateTable function
  describe('generateTable', () => {
    // Create a test case using the test function from your testing framework
    it('generateTable should generate the HTML table correctly', () => {
      // Create a DOM instance using JSDOM
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
      global.document = dom.window.document

      // Act
      const generatedTable = generateTable(testEvents)

      // Assert
      expect(generatedTable.tagName).toBe('TABLE')
      expect(generatedTable.id).toBe('openConsultationTable')
      expect(generatedTable.classList).toContain('table', 'table-striped')

      const tableRows = generatedTable.querySelectorAll('tbody tr')
      expect(tableRows.length).toBe(testEvents.length)

      const headerCells = generatedTable.querySelectorAll('thead tr th')
      expect(headerCells.length).toBe(Object.keys(testEvents[0]).length)
    })
  })

  // Test the redirectToGoogleCalendar function
  describe('redirectToGoogleCalendar', () => {
    // Create a test case using the test function from your testing framework
    test('redirectToGoogleCalendar should generate the correct Google Calendar URL', () => {
      // Arrange
      const eventDescription = 'Consultation'
      const personName = 'John Doe'
      const eventDate = '2023-05-28'
      const eventStartTime = '10:00:00'
      const eventDuration = 60

      // Act
      redirectToGoogleCalendar(eventDescription, personName, eventDate, eventStartTime, eventDuration)

      // Assert
      expect(window.open).toHaveBeenCalledWith(
        'https://calendar.google.com/calendar/r/eventedit' +
                '?text=Consultation' +
                '&dates=20230528T100000Z/20230528T110000Z' +
                '&details=Organized%20by%3A%20John%20Doe' +
                '&location=',
        '_blank'
      )
    })
  })

  // Test the filterAlreadyBookedConsultations function
  describe('filterAlreadyBookedConsultations', () => {
    test('should filter out already booked consultations', () => {
      const expectedNotBooked = [{
        PersonName: 'Asher Radowsky',
        NumberOfWeeks: 0,
        EventDescription: 'In present',
        EventStartTime: '10:54:00',
        EventDate: '2023-05-18',
        EventDuration: 60,
        SlotsPerDay: 1,
        EventId: 330,
        EventBookingCount: 0
      },
      {
        PersonName: 'Lecturer Testing',
        NumberOfWeeks: 0,
        EventDescription: 'In future',
        EventStartTime: '14:00:00',
        EventDate: '2023-05-20',
        EventDuration: 60,
        SlotsPerDay: 2,
        EventId: 381,
        EventBookingCount: 0
      },
      {
        PersonName: 'Steve Levitt',
        NumberOfWeeks: 0,
        EventDescription: 'In past',
        EventStartTime: '05:59:00',
        EventDate: '2023-05-15',
        EventDuration: 6,
        SlotsPerDay: 5,
        EventId: 356,
        EventBookingCount: 0
      }
      ]
      // Booked events test variable
      const bookedConsultations = [
        { eventId: 328 },
        { eventId: 331 },
        { eventId: 383 },
        { eventId: 380 },
        { eventId: 366 },
        { eventId: 364 }
      ]

      // Act
      const filteredEvents = filterAlreadyBookedConsultations(testEvents[0], bookedConsultations)

      // Assert
      expect(filteredEvents).toEqual(expectedNotBooked)
    })

    test('should return an empty array if all consultations are already booked', () => {
      const bookedConsultations = [
        { eventId: 328 },
        { eventId: 331 },
        { eventId: 383 },
        { eventId: 380 },
        { eventId: 366 },
        { eventId: 364 },
        { eventId: 330 },
        { eventId: 381 },
        { eventId: 356 }
      ]

      // Act
      const filteredEvents = filterAlreadyBookedConsultations(testEvents[0], bookedConsultations)

      // Assert
      expect(filteredEvents).toEqual([])
    })
  })
})
