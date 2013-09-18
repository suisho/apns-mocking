module.exports = {
  // create returning buffer
  createResponseBuffer : function(id, status){
    var buffer = new Buffer(6)
    buffer.writeUInt8(8,0)
    buffer.writeUInt8(status,1)
    //var buffer = new Buffer(6)
    //buffer.writeUInt8(status, 1)
    buffer.writeUInt32BE(id, 2)
    return buffer
  },
  // https://gist.github.com/rahuloak/4949381
  parseBuffer : function(data) {
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
    buffer.payload = JSON.stringify(pBuf.toString('utf8'))
    return buffer
  }

}
