const { createConsultation } = require('../s_dash')
const { findLecturerUpcomingConsultations, allConsultations } = require('../s_lecturerUpcomingConsultations')
const { lecDeleteBooking } = require('../s_lecDeleteBooking')

// Mock the database connection and queries
jest.mock('../db_connection', () => ({
    promise: jest.fn().mockReturnThis(), // Mock the promise method of the connection
    query: jest.fn() // Mock the query method of the connection
}))

describe('get all consultation events', () => {

    beforeEach(() => {
        require('../db_connection').promise.mockClear() // Reset the promise mock before each test case
        require('../db_connection').query.mockClear() // Reset the query mock before each test case
    })

    test('should retrieve all relevant consultations from the database', async () => {
        // Mock the query result
        const mockEvents = ['event1']
        const mockQuery = jest.fn().mockResolvedValueOnce(mockEvents)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        const personId = 48
        const filter = 'All'
        const consultations = await allConsultations(personId, filter)

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith("SELECT e.Id, e.PersonId, e.DOW, DATE_FORMAT(StartDate,'%Y-%m-%d') StartDate,DATE_FORMAT(EndDate,'%Y-%m-%d') EndDate, StartTime, EndTime, Duration, SlotsPerDay, Description  FROM event e WHERE PersonId = ? ORDER BY StartDate, StartTime", [personId])
        expect(consultations).toEqual(mockEvents[0])
    })

    test('should throw an error if there is an error retrieving consultations', async () => {
        const personId = 48
        const filter = 'All'
        // Mock the query to throw an error
        const mockError = new Error('Failed to retrieve consultations')
        const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        await expect(allConsultations(personId, filter)).rejects.toThrow(mockError)

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith("SELECT e.Id, e.PersonId, e.DOW, DATE_FORMAT(StartDate,'%Y-%m-%d') StartDate,DATE_FORMAT(EndDate,'%Y-%m-%d') EndDate, StartTime, EndTime, Duration, SlotsPerDay, Description  FROM event e WHERE PersonId = ? ORDER BY StartDate, StartTime", [personId])
    })

})

describe('get all consultation bookings', () => {
    beforeEach(() => {
        require('../db_connection').promise.mockClear() // Reset the promise mock before each test case
        require('../db_connection').query.mockClear() // Reset the query mock before each test case
    })

    test('should retrieve all relevant consultations from the database', async () => {
        // Mock the query result
        const mockEvents = ['event1']
        const mockQuery = jest.fn().mockResolvedValueOnce(mockEvents)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        const personId = 48
        const filter = 'All'
        const consultations = await findLecturerUpcomingConsultations(personId, filter)

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith("SELECT eb.Id, eb.eventId, eb.personId,DATE_FORMAT(Date,'%Y-%m-%d') Date, e.StartTime, e.Duration, e.Description, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ? ORDER BY StartDate, StartTime", [personId])
        expect(consultations).toEqual(mockEvents[0])
    })

    test('should throw an error if there is an error retrieving consultations', async () => {
        const personId = 48
        const filter = 'All'
        // Mock the query to throw an error
        const mockError = new Error('Failed to retrieve consultations')
        const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        await expect(findLecturerUpcomingConsultations(personId, filter)).rejects.toThrow(mockError)

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith("SELECT eb.Id, eb.eventId, eb.personId,DATE_FORMAT(Date,'%Y-%m-%d') Date, e.StartTime, e.Duration, e.Description, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ? ORDER BY StartDate, StartTime", [personId])
    })
})

describe('testing the creation of a consultation', () => {
    beforeEach(() => {
        require('../db_connection').promise.mockClear() // Reset the promise mock before each test case
        require('../db_connection').query.mockClear() // Reset the query mock before each test case
    })

    test('should create and insert consultation into database', async () => {
        // Mock the query result

        const mockConsultationData = [1, 'Fri', '2023-05-19', '2023-05-19', '11:35', '12:35', 60, 0, 2, 'TEST']
        const mockQuery = jest.fn().mockResolvedValueOnce(mockConsultationData)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        const result = await createConsultation(1, 'Fri', '2023-05-19', '2023-05-19', '11:35', '12:35', 60, 0, 2, 'TEST')

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith('INSERT INTO event (PersonId, DOW, StartDate, EndDate, StartTime, EndTime, Duration, RecurringWeeks, SlotsPerDay, Description) VALUES (?,?,?,?,?,?,?,?,?,?)', mockConsultationData)
        expect(result).toEqual(true)
    })

    test('should throw an error if there is an error creating a consultation', async () => {
        const mockConsultationData = [1, 'Fri', '2023-05-19', '2023-05-19', '11:35', '12:35', 60, 0, 2, 'TEST']
        // Mock the query to throw an error
        const mockError = new Error('Failed to create consultation')
        const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        await expect(createConsultation(1, 'Fri', '2023-05-19', '2023-05-19', '11:35', '12:35', 60, 0, 2, 'TEST')).rejects.toThrow(mockError)

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith('INSERT INTO event (PersonId, DOW, StartDate, EndDate, StartTime, EndTime, Duration, RecurringWeeks, SlotsPerDay, Description) VALUES (?,?,?,?,?,?,?,?,?,?)', mockConsultationData)
    })
})

describe('testing the deletion of a consultation', () => {
    beforeEach(() => {
        require('../db_connection').promise.mockClear() // Reset the promise mock before each test case
        require('../db_connection').query.mockClear() // Reset the query mock before each test case
    })

    test('should delete the consultation from the database', async () => {
        // Mock the query result
        const mockId = 25
        const mockQuery = jest.fn().mockResolvedValueOnce(mockId)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        const result = await lecDeleteBooking(mockId)
        const stat = result.status

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM event_booking WHERE Id = ?', [mockId])
        expect(stat).toEqual('Completed')
    })

    test('should throw an error if there is an error deleting a consultation', async () => {
        const mockId = 25
        // Mock the query to throw an error
        const mockError = new Error('Failed to delete consultation')
        const mockQuery = jest.fn().mockRejectedValueOnce(mockError)
        require('../db_connection').query.mockImplementationOnce(mockQuery)

        await expect(lecDeleteBooking(mockId)).rejects.toThrow(mockError)

        // Assertions
        expect(require('../db_connection').promise).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM event_booking WHERE Id = ?', [mockId])
    })
})

const { chromium } = require('playwright');
jest.setTimeout(30000);
describe('Lecturer Page functionality', () => {
    let browser, page;

    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    test('Lecturer logout test', async () => {
        await page.goto('https://consultamain.azurewebsites.net/');
        await page.type('#login-email', 'steve@wits.ac.za');
        await page.type('#login-password', 'software');
        // Click the button and then wait for the URL to change
        await Promise.all([
            page.click('#login-btn'),
            page.waitForFunction('window.location.href.includes("/lecturer_dashboard")')
        ]);

        // Check that user is redirected to correct page
        expect(await page.url()).toBe('https://consultamain.azurewebsites.net/lecturer_dashboard');

        // Click the logout button
        await Promise.all([
            page.click('button.btn-secondary'),
            page.waitForNavigation()
        ]);

        // Check that user is redirected to the login page
        expect(await page.url()).toBe('https://consultamain.azurewebsites.net/');
    });


})