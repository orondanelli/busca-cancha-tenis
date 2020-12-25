const axios = require('axios')
require('dotenv').config()
const client = require('twilio')()
var minimist = require('minimist')

var args = minimist(process.argv.slice(2), {
  string: 'date',
  string: 'target'
})
console.log(args)
if (Object.keys(args).length > 1) {
  let search = args.target
  let day = args.date

  axios.get('https://www.easycancha.com/api/sports/1/clubs/3/timeslots?date=' + day + '&timespan=60')
    .then(response => {
      let list = response.data.alternative_timeslots
      let ok = 0
      Object.keys(list).forEach(e => {
        list[e].hour == search ? ok++ : 0
      })
      if (ok > 0) {
        console.log('hay cancha')
        client.messages.create({
          from: 'whatsapp:+14155238886',
          body: 'Hay cancha para el ' + day + 'a las ' + search + ' hrs!',
          to: 'whatsapp:+56993109650'
        }).then(message => console.log(message.sid));
        client.messages.create({
          from: 'whatsapp:+14155238886',
          body: 'Marco: Hay cancha para el ' + day + 'a las ' + search + ' hrs! easycancha.cl',
          to: 'whatsapp:+56966206070'
        }).then(message => console.log(message.sid));
      } else {
        console.log('no hay cancha')
        client.messages.create({
          from: 'whatsapp:+14155238886',
          body: 'Seguimos buscando cancha para el' + day + 'a las ' + search + ' hrs!!',
          to: 'whatsapp:+56993109650'
        }).then(message => console.log(message.sid));
        client.messages.create({
          from: 'whatsapp:+14155238886',
          body: 'Marco, seguimos buscando cancha para el' + day + 'a las ' + search + ' hrs!',
          to: 'whatsapp:+56966206070'
        }).then(message => console.log(message.sid));
      }
    })
    .catch(error => {
      console.log(error);
    });
}
