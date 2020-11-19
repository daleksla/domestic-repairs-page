
import test from 'ava'
import Accounts from '../modules/accounts.js'

test('REGISTER : register and log in with a valid account', async test => {
	test.plan(1)
	const account = await new Accounts() // no database specified so runs in-memory
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
	  const login = await account.login('doej', 'password')
		test.is(login, true, 'unable to log in')
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
	}
})

test('REGISTER : register a duplicate username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "doej" already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('', 'password', 'customer', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', '', 'customer', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank type', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'salih1', '', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if invalid type', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'salih1', 'doctor', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'Account type "doctor" is invalid', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if duplicate email', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await account.register('bloggsj', 'newpassword', 'customer', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'email address "doej@gmail.com" is already in use', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('LOGIN : invalid username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await account.login('roej', 'password')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "roej" not found', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('LOGIN : invalid password', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer','doej@gmail.com')
		await account.login('doej', 'bad')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid password for account "doej"', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET TYPE : invalid username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await account.getType('roej')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "roej" not found', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET TYPE : type retrieval', async test => {
	test.plan(2)
	const account = await new Accounts()
	await account.register('testing', 'testing', 'customer', 'testing@outlook.com')
	let value = await account.getType('testing')
	test.is(value, 'customer')
	await account.register('tester', 'tester', 'technician', 'testingagain@outlook.com')
	value = await account.getType('tester')
	test.is(value, 'technician')
	account.close()
})

test('GET USERNAME : invalid id', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await account.getUsername(2)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'id "2" not found', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET USERNAME : username retrieval', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.register('testing', 'testing', 'customer', 'testing@outlook.com')
	let value = await account.getID('testing')
	value = await account.getUsername(value)
	test.is(value, 'testing')
	account.close()
})

test('GET ID : invalid username', async test => {
	test.plan(1)
	const account = await new Accounts()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await account.getID('rej')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'user "rej" not found', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('GET ID : id retrieval', async test => {
	test.plan(1)
	const account = await new Accounts()
	await account.register('testing', 'testing', 'customer', 'testing@outlook.com')
	const value = await account.getID('testing')
	test.is(value, 1)
	account.close()
})
