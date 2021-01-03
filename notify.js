const tools = require('./tools');
require('dotenv').config()
var minimist = require('minimist')
var clientRedis = require('redis').createClient(process.env.REDIS_URL);

var args = minimist(process.argv.slice(2), {
  string: 'date',
  string: 'target',
  number: 'repeat',
  default: {repeat: 6}
})
if (Object.keys(args).length > 1) {
  let search = args.target
  let day = args.date
  let keyUser = day + '|' + search
  let maxNotify = args.repeat

  console.log(maxNotify)
  clientRedis.on('connect', function () {
    console.log('Redis: Connected');
  });

  clientRedis.on("error", function (error) {
    console.error(error);
  });

  clientRedis.get(keyUser, async function (err, data) {
    if (data === null) {
      //** If doesn't exist key, then create a new key and query for availability */
      clientRedis.set(keyUser, "0", function (err, data) {
        console.log('Redis: Created a new key for ' + keyUser)
        let res = tools.validaMassu(day, search)
        if (res.status) {
          let msg = 'Hay cancha para el ' + day + ' a las ' + search + ' hrs!. Canchas nº: ' + res.courts
          console.log('msg sent: ' + msg)
          tools.sendSMS('+56993109650', msg)
          tools.sendSMS('+56966206070',msg)
          clientRedis.incr(keyUser) // ++ for notification counter
          console.log('Hay cancha: Mensajes enviados')
        } else {
          console.log('No hay cancha para: ' + keyUser)
        }
      })
      clientRedis.end(true)
    }
    else {
      /** If exists key, then query for availability */
      if (data >= maxNotify) {
        //clientRedis.del(keyUser)
        console.log(keyUser + ' deleted from Redis')
      } else {
        let res = await tools.validaMassu(day, search)
        if (res.status) {
          let msg = 'Hay cancha para el ' + day + ' a las ' + search + ' hrs!. Canchas nº: ' + res.courts
          console.log('msg sent: ' + msg)
          await tools.sendSMS('+56993109650', msg)
          await tools.sendSMS('+56966206070',msg)
          clientRedis.incr(keyUser)
          console.log('Hay cancha: Mensajes enviados')
        } else {
          /** Increment key for check max notifications.*/
          console.log('No hay cancha para: ' + keyUser)

        }
      }
      clientRedis.end(true)
    }
  })
}