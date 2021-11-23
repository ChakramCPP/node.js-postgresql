const db = require('../config/db.config.js');
const Student = db.Student;
const { Op } = require('sequelize')
const saveStudentDetails = require('../createStudentDb').saveStudentDetails

exports.create = (req, res) => {
  let student = {};

  try {
    // Building Student object from request's body
    student.name = req.body.name;
    student.age = req.body.age;
    student.mark1 = req.body.mark1;
    student.mark2 = req.body.mark2;
    student.mark3 = req.body.mark3;

    // Save to database
    Student.create(student).then(result => {
      res.status(200).json({
        message: "student created with id: " + result.id,
        student: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed creating a student",
      error: error.message
    });
  }
}

exports.retrieveAllStudents = (req, res) => {
  Student.findAll()
    .then(students => {
      res.status(200).json({
        message: "Successfully retrieved all students",
        students
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving all students",
        error: error
      });
    });
}

exports.getStudentById = (req, res) => {
  let studentId = req.params.id;
  Student.findByPk(studentId)
    .then(student => {
      res.status(200).json({
        message: "Successfully retrieved a student with id = " + studentId,
        student
      });
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "Error retrieving a student",
        error: error
      });
    });
}


exports.filteringByResult = (req, res) => {
  let resultStatus = req.query.resultStatus
  if (resultStatus == 'PASS') {
    Student.findAll({
      where: {
        [Op.and]: [
          {
            mark1: {
              [Op.gte]: 35
            }
          },
          {
            mark2: {
              [Op.gte]: 35
            }
          },
          {
            mark3: {
              [Op.gte]: 35
            }
          }
        ]
      }
    })
      .then(students => {
        res.status(200).json({
          message: "list of Students passed in all subjects ",
          students,
        })
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Error!",
          error: error
        })
      })
  } else if (resultStatus == 'FAIL') {
    Student.findAll({
      where: {
        [Op.or]: [
          {
            mark1: {
              [Op.lt]: 35
            }
          },
          {
            mark2: {
              [Op.lt]: 35
            }
          },
          {
            mark3: {
              [Op.lt]: 35
            }
          }
        ]
      }
    })
      .then(students => {
        res.status(200).json({
          message: "list of Students failed ",
          students,
        })
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: "Error!",
          error: error
        })
      })
  } else {
    res.status(404).send({
      message: "invalid resultStatus parameter"
    })
  }
}

exports.updateById = async (req, res) => {
  try {
    let studentId = req.params.id;
    let student = await Student.findByPk(studentId);

    if (!student) {
      res.status(404).json({
        message: "Couldn't find a student with id = " + studentId,
        student: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        name: req.body.name,
        age: req.body.age,
        mark1: req.body.mark1,
        mark2: req.body.mark2,
        mark3: req.body.mark3
      }
      let result = await Student.update(updatedObject, { returning: true, where: { id: studentId } });
      if (!result) {
        res.status(500).json({
          message: "Error: Can not update a student with id = " + req.params.id
        });
      }
      res.status(200).json({
        message: "Update successfully a student with id = " + studentId,
        student: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error: Can not update a student with id =" + req.params.id,
      error: error.message
    });
  }
}

exports.deleteById = async (req, res) => {
  try {
    let studentId = req.params.id
    let student = await Student.findByPk(studentId)

    if (!student) {
      res.status(404).json({
        message: "No student with id = " + studentId
      })
    } else {
      await student.destroy()
      res.status(200).json({
        message: "Successfully deleted a Student with id = " + studentId,
        student
      })
    }
  } catch (error) {
    res.status(500).json({
      message: "Error: Can NOT delete a student with id = " + req.params.id,
      error: error.message,
    })
  }
}

exports.upload = async (req, res) => {
  try {
    await saveStudentDetails(req, res, Student)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
}