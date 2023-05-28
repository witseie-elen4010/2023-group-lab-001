const { getAllEvents, addEventBooking, getAllConsults } = require('../s_student_page')
const { lecDeleteBooking } = require('../s_lecDeleteBooking')

// Mock the database connection and queries
jest.mock('../db_connection', () => ({
  promise: jest.fn().mockReturnThis(), // Mock the promise method of the connection
  query: jest.fn() // Mock the query method of the connection
}))

describe('getAllEvents', () => {
  beforeEach(() => {
    require('../db_connection').promise.mockClear() // Reset the promise mock before each test case
    require('../db_connection').query.mockClear() // Reset the query mock before each test case
  })

  test('should retrieve all events from the database', async () => {
    // Mock the query result
    const mockEvents = ['event1', 'event2']
    const mockQuery = jest.fn().mockResolvedValueOnce(mockEvents)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    const events = await getAllEvents()

    // Assertions
    expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith('SELECT p.Name AS PersonName, e.RecurringWeeks AS NumberOfWeeks, e.Description AS EventDescription, e.StartTime AS EventStartTime, e.StartDate AS EventDate, e.Duration AS EventDuration, e.Id AS EventId FROM event e JOIN person p ON e.PersonId = p.Id;')
    expect(events).toEqual(mockEvents)
  })

  test('should throw an error if there is an error retrieving events', async () => {
    // Mock the query to throw an error
    const mockError = new Error('Failed to retrieve events')
    const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    await expect(getAllEvents()).rejects.toThrow(mockError)

    // Assertions
    expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT p.Name AS PersonName, e.RecurringWeeks AS NumberOfWeeks, e.Description AS EventDescription, e.StartTime AS EventStartTime, e.StartDate AS EventDate, e.Duration AS EventDuration, e.Id AS EventId FROM event e JOIN person p ON e.PersonId = p.Id;'
    )
  })
})

describe('addEventBooking', () => {
  beforeEach(() => {
    require('../db_connection').promise.mockClear()
    require('../db_connection').query.mockClear()
  })

  test('should add an event booking to the database', async () => {
    // Mock the query result
    const mockResult = { affectedRows: 1 }
    const mockQuery = jest.fn().mockResolvedValueOnce(mockResult)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    const result = await addEventBooking(1, 2, '2023-05-19')

    // Assertions
    expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith('INSERT INTO event_booking (eventId, personId, Date) VALUES (?, ?, ?)', [1, 2, '2023-05-19'])
    expect(result).toEqual(mockResult)
  })

  test('should throw an error if there is an error adding the event booking', async () => {
    // Mock the query to throw an error
    const mockError = new Error('Failed to add event booking')
    const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    await expect(addEventBooking(1, 2, '2023-05-19')).rejects.toThrow(mockError)

    // Assertions
    expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith('INSERT INTO event_booking (eventId, personId, Date) VALUES (?, ?, ?)', [1, 2, '2023-05-19'])
  })

  test('should throw an error if adding event booking with invalid eventId', async () => {
    await expect(addEventBooking(undefined, 2, '2023-05-19')).rejects.toThrowError('Invalid eventId')
    await expect(addEventBooking(null, 2, '2023-05-19')).rejects.toThrowError('Invalid eventId')
    await expect(addEventBooking('', 2, '2023-05-19')).rejects.toThrowError('Invalid eventId')
    expect(require('../db_connection').promise).not.toHaveBeenCalled()
  })

  test('should throw an error if adding event booking with invalid personId', async () => {
    await expect(addEventBooking(1, undefined, '2023-05-19')).rejects.toThrowError('Invalid personId')
    await expect(addEventBooking(1, null, '2023-05-19')).rejects.toThrowError('Invalid personId')
    await expect(addEventBooking(1, '', '2023-05-19')).rejects.toThrowError('Invalid personId')
    expect(require('../db_connection').promise).not.toHaveBeenCalled()
  })

  test('should throw an error if adding event booking with invalid Date', async () => {
    await expect(addEventBooking(1, 2, undefined)).rejects.toThrowError('Invalid Date')
    await expect(addEventBooking(1, 2, null)).rejects.toThrowError('Invalid Date')
    await expect(addEventBooking(1, 2, '')).rejects.toThrowError('Invalid Date')
    await expect(addEventBooking(1, 2, '2023-02-30')).rejects.toThrowError('Invalid Date')
    expect(require('../db_connection').promise).not.toHaveBeenCalled()
  })
})

describe('getAllConsults', () => {
  beforeEach(() => {
    require('../db_connection').promise.mockClear() // Reset the promise mock before each test case
    require('../db_connection').query.mockClear() // Reset the query mock before each test case
  })

  test('should retrieve all consultations from the database', async () => {
    // Mock the query result
    const mockConsults = ['consult1', 'consult2', 'consult3']
    const mockQuery = jest.fn().mockResolvedValueOnce(mockConsults)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    const personId = 41 // Set the personId value

    const consults = await getAllConsults(personId)

    // Assertions
    expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT e.StartTime, e.StartDate, eb.eventId, eb.Id AS bookingId, p.name AS lecturerName FROM event_booking eb JOIN event e ON eb.EventId = e.Id JOIN person p ON p.Id = e.PersonId WHERE eb.personId = ?',
      [personId]
    )
    expect(consults).toEqual(mockConsults[0])
  })

  test('should throw an error if there is an error retrieving consultations', async () => {
    // Mock the query to throw an error
    const mockError = new Error('Failed to retrieve consultations')
    const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    const personId = 41 // Set the personId value

    await expect(getAllConsults(personId)).rejects.toThrow(mockError)

    // Assertions
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT e.StartTime, e.StartDate, eb.eventId, eb.Id AS bookingId, p.name AS lecturerName FROM event_booking eb JOIN event e ON eb.EventId = e.Id JOIN person p ON p.Id = e.PersonId WHERE eb.personId = ?',
      [personId]
    )
  })
})

describe('deleteBooking', () => {
  beforeEach(() => {
    require('../db_connection').promise.mockClear()
    require('../db_connection').query.mockClear()
  })

  test('should delete a booking from the dashboard and the database', async () => {
    // Mock the query result
    const mockResult = { affectedRows: 1 }
    const mockQuery = jest.fn().mockResolvedValueOnce(mockResult)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    const bookingId = 142

    const result = await lecDeleteBooking(bookingId)

    // Assertions
    expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith('DELETE FROM event_booking WHERE Id = ?', [bookingId])
    expect(result).toEqual({ status: 'Completed' })
  })
  test('should throw an error when deleting a booking from the dashboard and the database', async () => {
    // Mock the query result
    const mockError = new Error('Failed to delete booking')
    const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
    require('../db_connection').query.mockImplementationOnce(mockQuery)

    const bookingId = 'hello' // give an invalid bookingId

    await expect(lecDeleteBooking(bookingId)).rejects.toThrow(mockError)

    // Assertions
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith('DELETE FROM event_booking WHERE Id = ?', [bookingId])
  })
})
