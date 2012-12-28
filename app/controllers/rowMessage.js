var args = arguments[0] || {};

if(args.me) $.message.textAlign = 'right';
$.message.text = args.message || '';
 
