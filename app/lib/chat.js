var io = require('socket.io');

var socket;

exports.connect = function(o){
	if(socket){
		alert('disconnect');
		exports.disconnect();
	}
	
	socket = io.connect("http://sandtonio.chat.jit.su:80");
	//socket = io.connect("http://192.168.0.7:3000");
	
	socket.on("connect", function(){		
	});
	
	socket.on("joinResult", function(e){
		if(o.joinResult) o.joinResult(e);		
	});
	
	socket.on("nameResult", function(e){
		if(o.nameResult) o.nameResult(e);
		
	});
	
	socket.on("message", function(e){
		if(o.message) o.message(e);
	});
	
	socket.on('rooms', function(e){	
		if(o.rooms) o.rooms(e);
	});
	
	socket.on('disconnect', function(){
		if(o.disconnect) o.disconnect();
		
		exports.disconnect();
	});
	
	socket.on("connect_failed", function(e){
		//alert('Failed');
	});
	
	socket.on('error',function(e){
		//alert(e);
	});
}

exports.message = function(e){
	if(socket){
		socket.emit('message', {
			room:e.room,
			text:e.text
		});
	}
	
}

exports.room = function(e){
	if(socket){
		socket.emit('join', {
			newRoom:e.room			
		});
	}
}

exports.disconnect = function(){
	if(socket){
		socket.disconnect();
	}
}

exports.rooms= function(){
	socket.emit('rooms');
}
