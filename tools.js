'use string'
const environment = require('dotenv').config()
const axios = require('axios')
const client = require('twilio')()

exports.validaMassu = async (day, search) => {
    let counter = 0
    let courts = []
    await axios.get('https://www.easycancha.com/api/sports/1/clubs/3/timeslots?date=' + day + '&timespan=60')
    .then(response => {
        let list = response.data.alternative_timeslots
        Object.keys(list).forEach(e => {
            if(list[e].hour == search){
                counter++
                list[e].timeslots.forEach(item => courts.push(item.courtNumber))
            }
        })
    })
    if (counter > 0) {
        let obj = {status:true, courts:courts.toString()}
        return obj
    } else {
        return {status:false}
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
