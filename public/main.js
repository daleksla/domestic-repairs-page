
/* main.js */

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded')
	let myMessage = ''
	const toggleCount = 2500
	document.querySelectorAll('aside').forEach( term => {
	  if(term.includes('...')) myMessage = term
	})
	window.setTimeout( () => {
		myMessage.classList.toggle('msg')
	}, toggleCount)
// 	if(document.querySelector('aside')) {
// 		const delay = 2000
// 		document.querySelector('aside').hidden = false
// 		window.setTimeout( () => {
// 			document.querySelector('aside').hidden = false
// 		}, delay)
})
