const express = require('express')
const router = express.Router()
const upload = require("../middlewares/upload");
const students = require('../controllers/controller.js')

router.post('/api/upload',  upload.single("file"), students.upload)
router.get('/api/students', students.filteringByResult)
router.post('/api/students/create', students.create)
router.get('/api/students/all', students.retrieveAllStudents)
router.get('/api/students/:id', students.getStudentById)
router.put('/api/students/update/:id', students.updateById)
router.delete('/api/students/delete/:id', students.deleteById)

module.exports = router