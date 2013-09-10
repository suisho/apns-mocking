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

var server = tls.createServer({
  pfx : fs.readFileSync('mock.p12'), // mock
  passphrase : 'mock',                    //mock
} , function(socket) {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');

  socket.on('data', function(data){
    allData.push(data)
  })
  socket.on('end', function(){
    allData.forEach(function(data){
      try{
        var buffer = readBuffer(data)
        console.log(buffer)
        socket.write("0")
      }catch(e){
        console.log(e)
        socket.write("1")
      }
    })
    socket.end()
  })
}).listen(PORT)

// https://gist.github.com/rahuloak/4949381
var readBuffer = function(data) {
  var buffer = {}
  var offset = 0;
  // Command byte
  buffer.command = data.readUInt8(offset);

  offset++;
  
  // Handle enhanced mode
  if( buffer.command == 1 ) {
    // Identifier
    buffer.id = data.readUInt32BE(offset);
    offset += 4;
    
    // Expiration
    buffer.expiry = data.readUInt32BE(offset);
    offset += 4;
  }
  
  // Token length
  buffer.tokenLength = data.readUInt16BE(offset);
  offset += 2;
  
  // Token
  var tempBuf = new Buffer(buffer.tokenLength);
  data.copy(tempBuf, 0, offset, offset+buffer.tokenLength);
  buffer.token = tempBuf.toString('hex');
  offset += buffer.tokenLength;
  
  // Payload length
  var payloadLength = data.readUInt16BE(offset);
  offset += 2;
  
  // Payload
  var pBuf = new Buffer(payloadLength);
  data.copy(pBuf, 0, offset, offset+payloadLength);
  buffer.payload = pBuf.toString('utf8');
  return buffer
}
