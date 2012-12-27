var chat = require('chat');

$.options.on('click', function(e){
	if(e.source.active){
		$.detail.animate({
			duration:200,
			left:'0px'
		});
		e.source.active = false;
	}else{
		$.detail.animate({
			duration:200,
			left:(Ti.Platform.displayCaps.platformWidth-45) + 'px'
		});	
		e.source.active = true;
	}	
});

$.index.on('open', function(){	
	chat.connect({
		joinResult: function(e){			
			$.room.text = "Room: "+ e.room;
		},
		nameResult: function(e){
			alert(e);
		},
		message: function(e){
			alert(e);
		},
		disconnect: function(e){
			alert('disconnect...');
		}
	});
	
	setTimeout(function(){
		alert('change');
	$.message.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	},500);	
	
});


$.index.open();
