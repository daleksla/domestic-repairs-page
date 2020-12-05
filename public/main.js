
/* main.js */

window.addEventListener('DOMContentLoaded', () => {
	if(document.querySelector('aside')) {
		document.querySelector('aside').addEventListener('click', () => {
			document.getElementById('notification').remove()
			console.log('Message removed by click')
		})
		const delay = 2500
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = true
		}, delay)
		console.log('Message removed by timeout')
	}
})

window.addEventListener('DOMContentLoaded', () => {
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

window.addEventListener('scroll', () => {
	console.log('scrolling occuring')
	if(document.querySelector('header')) {
		const header = document.getElementById('header')
		const sticky = header.offsetTop
		if (window.pageYOffset > sticky) header.classList.add('sticky')
		else header.classList.remove('sticky')
	}
})

window.addEventListener('Dark mode button', () => {
	document.getElementById('mode').addEventListener('click', () => {
		//edit this to make this work
		const button = document.getElementById('mode')
		if(button.innerText === 'Toggle dark mode') {
			//activate light mode
			button.innerText = 'Toggle light mode'
			console.log('Dark mode on')
		} else if(button.innerText === 'Toggle light mode') {
			//activate dark mode
			button.innerText = 'Toggle dark mode'
			console.log('Light mode on')
		}
	})
})
