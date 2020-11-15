
/* main.js */

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded')
// 	document.querySelectorAll('aside').forEach( term => {
// 	  if(term.includes('...')) const myMessage = term
// 	})
// 	window.setTimeout( () => {
// 		myMessage.classList.toggle("msg");
// 		}, 2500
// 	)
	if(document.querySelector('aside')) {
		const delay = 2000
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = false
		}, delay)
	}
})
