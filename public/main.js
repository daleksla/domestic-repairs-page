
/* main.js */

window.addEventListener('DOMContentLoaded', () => { //to remove msg
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

window.addEventListener('DOMContentLoaded', () => { //to display custom messages
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

window.addEventListener('scroll', () => { //to make a fixed header
	console.log('scrolling occuring')
	if(document.querySelector('header')) {
		const header = document.getElementById('header')
		const sticky = header.offsetTop
		if (window.pageYOffset > sticky) header.classList.add('sticky')
		else header.classList.remove('sticky')
	}
})

window.addEventListener('DOMContentLoaded', () => { //dark mode button
	if(document.querySelector('button')) {
		document.querySelector('button').addEventListener('click', () => {
			const button = document.querySelector('button')
			if(button.innerText === 'Toggle dark mode') {
				//activate dark mode
				button.innerText = 'Toggle light mode'
				window.localStorage.mode = 'dark'
				document.body.classList.add('dark-mode')
				// 				document.querySelector('img').src = '3014275.svg'
				console.log('Dark mode on')
			} else if(button.innerText === 'Toggle light mode') {
				//activate light mode
				button.innerText = 'Toggle dark mode'
				window.localStorage.mode = 'light'
				document.body.classList.remove('dark-mode')
				// 				document.querySelector('img').src = '3014274.svg'
				console.log('Light mode on')
			}
		})
	}
})

window.addEventListener('DOMContentLoaded', () => { //to load and format pages
	try {
		const mode = window.localStorage.mode
		if(mode === 'dark') {
			document.body.classList.add('dark-mode')
			document.querySelector('button').innerText = 'Toggle light mode'
			// 			document.querySelector('img').src = '3014275.svg'
		} else {
			document.body.classList.remove('dark-mode')
			document.querySelector('button').innerText = 'Toggle dark mode'
			// 			document.querySelector('img').src = '3014274.svg'
		}
	} finally {
		console.log('Data loaded from local storage')
	}
	const elements = document.getElementsByTagName('br')
	while (elements[0]) elements[0].parentNode.removeChild(elements[0])
	console.log('Page formatted')
})
