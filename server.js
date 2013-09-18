// csr  : 署名リクエスト
// cert : 
// ca   : 認証局
// key  : sign-key
// p12  : pkcs#12  = pfx。現在は違いがない？
// pem  : 
var PORT = 3434
var tls = require('tls')
var fs = require('fs')
var allData = [];
var bufferLib = require("./lib/buffer")

var processData = function(data){
  try{
    var buffer = bufferLib.parseBuffer(data)
    return bufferLib.createResponseBuffer(buffer.id, 255)
  }catch(e){

  }
}

var server = tls.createServer({
  pfx : fs.readFileSync('mock.p12'), // mock
  passphrase : 'mock',                    //mock
} , function(socket) {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');

  socket.on('data', function(data){
    console.log("on data")
    var returnData = processData(data)
    console.log(JSON.stringify(returnData))

    socket.write(returnData, 'binary')
  })
  socket.on('end', function(){
    console.log("end")
    socket.end()
  })
}).listen(PORT)

// create returning buffer

/*console.log(JSON.stringify(returnBuffer(1,1)))
console.log(JSON.stringify(returnBuffer(1,255)))
console.log(JSON.stringify(returnBuffer(100,1)))
console.log(JSON.stringify(returnBuffer(100,255)))*/
