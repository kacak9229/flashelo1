module.exports = {

  port: process.env.PORT || 3030,
  // database: process.env.DATABASE || 'mongodb://root:abc123@ds157288.mlab.com:57288/flashelo',
  database: process.env.DATABASE || 'mongodb://localhost/flashelo',
  secret: process.env.SECRETKEY || 'FLASHELOV1HAHAHANAUFALTHEGREAT'

}
