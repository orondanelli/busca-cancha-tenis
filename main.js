const axios = require('axios')
var minimist = require('minimist')

var args = minimist(process.argv.slice(2), {
    string: 'date',
    string: 'target'
  })

let search = args.target
let day = args.date

axios.get('https://www.easycancha.com/api/sports/1/clubs/3/timeslots?date='+ day +'&timespan=60')
  .then(response => {
    let list = response.data.alternative_timeslots
    let ok = 0
    Object.keys(list).forEach(e => {
        list[e].hour == search ? ok++:0
    })
    if(ok >0 ){
        console.log('hay cancha')
    } else {
        console.log('no hay cancha')
    }
  })
  .catch(error => {
    console.log(error);
  });
