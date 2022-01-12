const e = require("express")

const diabeticQuestionnaire = {
    "error": false,
    "payload": {
        "someKey": "value",
        "questionnaire": [
            {
                "img": "http://url",
                "title": "screen-title",
                "questions": [
                    {
                        "title": "What is your age?",
                        "key": "age",
                        "type": "number",
                        "min": 18,
                        "max": 90,
                        "required": true,
                        "error": "some error"
                    },
                    {
                        "title": "What is your height (cms)?",
                        "key": "height",
                        "type": "number",
                        "min": 120,
                        "max": 210,
                        "required": true
                    }
                ]
            }
        ] 
    
    }
}
exports.getQuestionnaire = (req, res) => {
    // res.send('here is the questionnaire')
    try {
        const goal = req.body.goal
        if(goal === 'diabetes'){
            res.status(200)
            res.send(diabeticQuestionnaire)
        }
    } catch(err){
        console.error(' some error while retrieving the questionnaire')
    }
  }

exports.saveQuestionnaire = (req, res) => {
    // res.send('Successfully validated and saved the questionnarie')
    const diabeticResponse = req.body.payload
    // console.log(diabeticQuestionnaire.payload.questionnaire.questions)
    for (const questionnaire of diabeticQuestionnaire.payload.questionnaire){
        for (const question of questionnaire.questions) {
            let value,isValidType

        if(question.required){
            value = diabeticResponse[question.key] ? diabeticResponse[question.key] : res.send(`Missing mandatory properties:${question.key}`)
        } else {
            value = diabeticResponse[question.key] ? diabeticResponse[question.key] : undefined
            if(!value)
                continue
        }
        validateType(question.type,value) ? 'valid Type' : res.send(`Mismatch in the type for the property:${question.key}`)
        (question.type == typeof(value)) ? 'valid Type' : res.send(`Mismatch in the type for the property:${question.key}`)
    
        (value<question.min || value> question.max) ? 'valid Range' : res.send(`value doesnt fall in the range for the property:${question.key}`)
        }
    }
}

// basicValidation, 