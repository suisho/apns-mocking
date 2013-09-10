// csr  : 署名リクエスト
// cert : 
// ca   : 認証局
// key  : sign-key
// p12  : pkcs#12  = pfx。現在は違いがない？
// pem  : 
var PORT = 3434
var tls = require('tls')
var fs = require('fs')

var server = tls.createServer({
  pfx : fs.readFileSync('mock.p12'), // mock
  passphrase : 'mock',                    //mock
} , function(cleartextStream) {
  console.log('server connected',
              cleartextStream.authorized ? 'authorized' : 'unauthorized');
  cleartextStream.setEncoding('utf8');

  cleartextStream.on('data', function(data){
    console.log(data)
  })
  cleartextStream.on('end', function(){
    //console.log("aa")
    //cleartextStream.write(0)
  })
}).listen(PORT)
*/
var readBuffer = function(data) {
 
  var offset = 0;
  
  // Command byte 
  var command = data.readUInt8(offset);
  offset++;
  
  // Handle enhanced mode
  if( command == 1 ) {
    // Identifier
    var id = data.readUInt32BE(offset);
    offset += 4;
    
    // Expiration
    var expiry = data.readUInt32BE(offset);
    offset += 4;
  }
  
  // Token length
  var tokenLength = data.readUInt16BE(offset);
  offset += 2;
  
  // Token
  var tempBuf = new Buffer(tokenLength);
  data.copy(tempBuf, 0, offset, offset+tokenLength);
  var token = tempBuf.toString();
  offset += tokenLength;
  
  // Payload length
  var payloadLength = data.readUInt16BE(offset);
  offset += 2;
  
  // Payload
  var pBuf = new Buffer(payloadLength);
  data.copy(pBuf, 0, offset, offset+payloadLength);
  var payload = pBuf.toString();
 }