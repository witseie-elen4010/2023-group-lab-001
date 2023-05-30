'use strict'

test('Just a dummy test to check jest is working', () => {
  // doNothing
})

/* const {
  filterPastEvents,
  processConsults
} = require('../public/c_student_portal_page.js')

describe('filterPastEvents', () => {
  it('should filter out consultations which have passed the current date', () => {
    const object1 = {
      Description: 'This consult should be filtered out as it happened in 2020',
      Duration: 120,
      StartDate: '2020-04-30',
      StartTime: '11:00:00',
      bookingId: 721,
      eventId: 366,
      lecturerName: 'Dr Levitt'
    }

    // Act
    const filteredEvents = removePastEvents([object1])

    // Assert
    expect(filteredEvents).toEqual([])
  })

  it('should keep consultations which are yet to come', () => {
    const object1 = {
      Description: 'This consult should not be filtered out',
      Duration: 120,
      StartDate: '2023-08-30',
      StartTime: '11:00:00',
      bookingId: 721,
      eventId: 366,
      lecturerName: 'Dr Levitt'
    }

    // Act
    const filteredEvents = removePastEvents([object1])

    // Assert
    expect(filteredEvents).toEqual([object1])
  })
})

describe('processConsults', () => {
  it('should sort the consultations by date', () => {
    const object1 = {
      Description: 'This consult should appear second after sorting',
      Duration: 120,
      StartDate: '2023-06-20',
      StartTime: '12:00:00',
      bookingId: 720,
      eventId: 376,
      lecturerName: 'Dr Levitt'
    }
    const object2 = {
      Description: 'This consult should appear first after sorting',
      Duration: 60,
      StartDate: '2020-04-30',
      StartTime: '11:00:00',
      bookingId: 721,
      eventId: 366,
      lecturerName: 'Dr Levitt'
    }

    // Act
    const sortedEvents = processConsults([object1, object2])

    // Assert
    expect(sortedEvents).toEqual([object2, object1])
  })
}) */
