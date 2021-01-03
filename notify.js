const tools = require('./tools');
require('dotenv').config()
var minimist = require('minimist')
var clientRedis = require('redis').createClient(process.env.REDIS_URL);

var args = minimist(process.argv.slice(2), {
  string: 'date',
  string: 'target'
})

if (Object.keys(args).length > 1) {
  let search = args.target
  let day = args.date
  let keyUser = day+'|'+search
  let maxNotify = 2

  clientRedis.on('connect', function() {
    console.log('connected to Redis');
  });
  
  clientRedis.on("error", function(error) {
    console.error(error);
  });
  
  clientRedis.get(keyUser, function(err,data){
    if (data ===null){
      //** If doesn't exist key, then create a new key and query for availability */
      clientRedis.set(keyUser,"0", function(err,data){
        if (tools.validaMassu(day,search)){
          let msg = 'Hay cancha para el ' + day + ' a las ' + search + ' hrs! www.easycancha.cl'
          tools.sendSMS('+56993109650',msg)
          tools.sendSMS('+56966206070',msg)
          clientRedis.incr(keyUser) // ++ for notification counter
          console.log('Hay cancha: Mensajes enviados')
        } else {
          console.log('No hay cancha')
        }      
      })
      clientRedis.end(true);
    }
    else{
      /** If exists key, then query for availability */
      if (tools.validaMassu(day,search)){
          let msg = 'Hay cancha para el ' + day + ' a las ' + search + ' hrs! www.easycancha.cl'
          tools.sendSMS('+56993109650',msg)
          tools.sendSMS('+56966206070',msg)
          clientRedis.incr(keyUser)
          clientRedis.end(true)
          console.log('Hay cancha: Mensajes enviados')
        } else {
      /** Increment key for check max notifications.*/
          clientRedis.incr(keyUser)
          clientRedis.get(keyUser, function(err,data){
            if (data >= maxNotify){
              clientRedis.del(keyUser)
              console.log(keyUser + ' deleted from Redis')
            }
          clientRedis.end(true);
          })
          console.log('No hay cancha')
        }
      }})
    }