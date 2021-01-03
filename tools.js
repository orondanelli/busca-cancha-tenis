'use string'
const environment = require('dotenv').config()
const axios = require('axios')
const client = require('twilio')()

exports.validaMassu = async (day, search) => {
    let counter = 0
    await axios.get('https://www.easycancha.com/api/sports/1/clubs/3/timeslots?date=' + day + '&timespan=60')
    .then(response => {
        let list = response.data.alternative_timeslots
        Object.keys(list).forEach(e => {
            list[e].hour == search ? counter++ : 0
        })
    })
    if (counter > 0) {
        return true
    } else {
        return false
    }
  }

exports.sendSMS = (to, body) => {
    client.messages.create({
        from: '+14793484019',
        body: body,
        to: to
      }).then(message => {
        console.log(message.sid)
      });
}
