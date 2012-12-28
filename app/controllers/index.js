var chat = require('chat');
var nMessages = 0;
var room = 'Lobby'

$.master.width = (Ti.Platform.displayCaps.platformWidth-45)+'px';

//Events
$.options.on('click', optionsClick);
$.send.on('singletap', sendMessage);
$.textFieldRooms.on('return', textRoom);
$.tableRooms.on('click', tableRoomsClick);
$.index.on('open', inOpen);

$.index.open();


//Functions
function inOpen(e){
	chat.connect({
		joinResult: joinResult,				
		nameResult: nameResult,				
		message: newMessage,		 		
		disconnect: disconnect,			
		rooms: createRooms			
	});
	
	setInterval(function(){
		chat.rooms();
	},3000);
	
	setTimeout(function(){		
		$.message.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		$.textFieldRooms.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	},500);
}

function createRooms(e){
	var data = [];			
	for(var room in e){
		room = room.substring(1, room.length); 
		if(room){
			var row = Alloy.createController('rowRoom',{
				room:room
			}).getView();
			data.push(row);
		}
	}
	$.tableRooms.setData(data);
}

function disconnect(e){
	
}

function newMessage(e){
	$.conversation_table.appendRow(Alloy.createController('rowMessage',{
		message:e.text,
		me:false
	}).getView());
	
	scrollToIndex();
	nMessages++;
}

function joinResult(e){
	$.room.text = e.room;
	room = e.room;
}

function nameResult(e){
	if(e.success){
		$.user.text = e.name			
	}
}

function sendMessage(e){
	if($.message.value){									
		$.conversation_table.appendRow(Alloy.createController('rowMessage',{
			message:$.message.value,
			me:true
		}).getView());
		
		chatMessage();
		scrollToIndex();		
		$.message.value = '';
		nMessages++;		
	}
	closeKeyboard();
}

function chatMessage(){
	chat.message({
		room:room,
		text: $.message.value
	});
}

function scrollToIndex(){
	$.conversation_table.scrollToIndex(nMessages,{
		animated:true
	});
}

function tableRoomsClick(e){
	if(e.rowData.id === 'rowRoom'){
		room = e.row.at;
		changeRoom();			
		closeMenu();
	}	
}

function changeRoom(){	
	chat.room({
		room:room		
	});
}

function closeKeyboard(){
	Ti.UI.Android.hideSoftKeyboard();
}

function optionsClick(e){
	if(e.source.active){
		closeMenu();
		e.source.active = false;
	}else{
		openMenu();	
		e.source.active = true;
	}
}

function openMenu(){
	$.detail.animate({
		duration:200,
		left:(Ti.Platform.displayCaps.platformWidth-45) + 'px'
	});		
}

function closeMenu(){
	$.detail.animate({
		duration:200,
		left:'0px'
	});
}

function textRoom(){
	var newRoom = $.textFieldRooms.value.split(' ');	
	room = newRoom[0];
	$.textFieldRooms.value = '';
	closeKeyboard();
	changeRoom();
	closeMenu();	
}

