'use string'
const environment = require('dotenv').config()
const axios = require('axios')
const client = require('twilio')()

exports.validaMassu = (day, search) => {
        axios.get('https://www.easycancha.com/api/sports/1/clubs/3/timeslots?date=' + day + '&timespan=60')
        .then(response => {
            let list = response.data.alternative_timeslots
            let ok = 0
            Object.keys(list).forEach(e => {
                list[e].hour == search ? ok++ : 0
            })
            if (ok > 0) {
                return true
            } else {
                return false
            }
        })
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
