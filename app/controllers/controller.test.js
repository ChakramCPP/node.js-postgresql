const studentController = require('./controller')
const Student = require('../config/db.config.js').Student
global.__basedir = '/Users/nallamc/Desktop/node.js-postgresql'
jest.mock('../createStudentDb')
// Test cases are incomplete
describe("student controller tests", () => {
    it('should read the uploaded file and write to database', async () => {
        const req = {
            file: {
                originalname: 'students.csv',
                filename: 'students.csv'
            }
        }
        const res = {
            send: jest.fn(),
            status: jest.fn()
        }
        const spyBulkCreate = jest.spyOn(require('../createStudentDb'), 'saveStudentDetails')
            .mockImplementation(() => Promise.resolve('Done'))
        await studentController.upload(req, res)
        expect(spy).toHaveBeenCalled()
        expect(res.send).toHaveBeenCalledWith({
            message:
                "Uploaded the file successfully: " + 'students.csv',
        })
        expect(res.status).toHaveBeenCalledWith(200)
    })
    it('should read the uploaded file and fail to write to database', async () => {
        const req = {
            file: {
                originalname: 'students.csv',
                filename: 'students.csv'
            }
        }
        const res = {
            send: jest.fn(),
            status: jest.fn()
        }
        const spy = jest.spyOn(require('../createStudentDb'), 'saveStudentDetails')
            .mockImplementationOnce(() => Promise.reject('SOME RANDOM ERROR'))
        await studentController.upload(req, res)
        expect(res.send).toHaveBeenCalledWith({
            message: "Fail to import data into database!",
            error: 'SOME RANDOM ERROR',
        })
        expect(res.status).toHaveBeenCalledWith(500)
        expect(spy).toHaveBeenCalled()
    })
})