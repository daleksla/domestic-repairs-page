
/* main.js */

window.addEventListener('DOMContentLoaded', event => {
	console.log('DOMContentLoaded', event)
	document.querySelector('aside').addEventListener('click', event => {
		document.getElementById("notification").remove();
	})
	if(document.querySelector('aside')) {
		const delay = 2500
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = true
		}, delay)
	}
	if(document.querySelector('input')) {//if one input field on page
		document.querySelectorAll('input').forEach(element => {//go through each object
			element.addEventListener('invalid', event => {
				if(!event.target.validity.valid) {
					const message = event.target.dataset.message || 'invalid data'
					event.target.setCustomValidity(message)
				}
			})
			element.addEventListener('input', event => {//reset message
				event.target.setCustomValidity('')
			})
		}, false)
	}
})
