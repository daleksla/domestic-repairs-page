
/* main.js */

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded')
	document.querySelectorAll('aside').forEach( term => {
	  if(term.includes('...')) const myMessage = term
	})
	window.setTimeout( () => {
		myMessage.classList.toggle("msg");
		}, 2500
	)
})
