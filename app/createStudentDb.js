const csv = require('fast-csv')
const fs = require('fs')

async function saveStudentDetails(req, res, Student) {
  if (req.file == undefined) {
    return res.status(400).send("Please upload a CSV file!");
  }
  let students = [];
  let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
  fs.createReadStream(path)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => {
      throw error.message
    })
    .on("data", (row) => {
      students.push(row)
    })
    .on("end", () => {
      Student.bulkCreate(students)
        .then(() => {
          res.status(200).send({
            message:
              "Uploaded the file successfully: " + req.file.originalname,
          })
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          })
        })
    })
}
module.exports = {
  saveStudentDetails
}