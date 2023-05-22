const { getAllEvents, addEventBooking, getAllConsults } = require('../s_student_page')

// Mock the database connection and queries
jest.mock('../db_connection', () => ({
  promise: jest.fn().mockReturnThis(), // Mock the promise method of the connection
  query: jest.fn()// Mock the query method of the connection
}))

describe('getAllEvents', () => {
  beforeEach(() => {
    require('../db_connection').promise.mockClear()// Reset the promise mock before each test case
    require('../db_connection').query.mockClear()// Reset the query mock before each test case
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
    expect(mockQuery).toHaveBeenCalledWith('SELECT p.Name AS PersonName, e.Description AS EventDescription, e.StartTime AS EventStartTime, e.StartDate AS EventDate, e.Duration AS EventDuration, e.Id AS EventId FROM event e JOIN person p ON e.PersonId = p.Id;')
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
    expect(mockQuery).toHaveBeenCalledWith('SELECT p.Name AS PersonName, e.Description AS EventDescription, e.StartTime AS EventStartTime, e.StartDate AS EventDate, e.Duration AS EventDuration, e.Id AS EventId FROM event e JOIN person p ON e.PersonId = p.Id;')
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
