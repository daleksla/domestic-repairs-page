
import test from 'ava'
import Jobs from '../modules/jobs.js'
import Accounts from '../modules/accounts.js'

test('REGISTER : error if blank job', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('', 'unassigned', accountID)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('REGISTER : error if blank status', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('fridge', '', accountID)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('REGISTER : error if blank customerID', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		await job.register('fridge', 'unassigned', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('REGISTER : error if invalid status', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('fridge', 'random', accountID)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'status "random" is invalid', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('GET STATUS : invalid user', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('fridge', 'resolved', accountID)
		await job.getStatus('fridge', accountID+1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'customer with customerID "2" not found', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('GET STATUS : status retrieval', async test => {
	test.plan(3)
	const account = await new Accounts()
	const job = await new Jobs()
	await account.register('doej', 'password', 'customer', 'doej@gmail.com')
	const accountID = await account.getID('doej')

	await job.register('fridge', 'unassigned', accountID)
	let value = await job.getStatus('fridge', accountID)
	test.is(value, 'unassigned')

	await job.register('dishwasher', 'in progress', accountID)
	value = await job.getStatus('dishwasher', accountID)
	test.is(value, 'in progress')

	await job.register('boiler', 'resolved', accountID)
	value = await job.getStatus('boiler', accountID)
	test.is(value, 'resolved')

	account.close()
	job.close()
})

test('UPDATE STATUS : error if blank job', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('fridge', 'unassigned', accountID)
		await job.updateStatus('', 'resolved', accountID)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('UPDATE STATUS : error if blank status', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('fridge', 'unassigned', accountID)
		await job.updateStatus('fridge', '', accountID)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('UPDATE STATUS : error if blank customerID', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	try {
		await account.register('doej', 'password', 'customer', 'doej@gmail.com')
		const accountID = await account.getID('doej')
		await job.register('fridge', 'unassigned', accountID)
		await job.updateStatus('fridge', 'unassigned', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		job.close()
	}
})

test('UPDATE STATUS : status update', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	await account.register('doej', 'password', 'customer', 'doej@gmail.com')
	const accountID = await account.getID('doej')
	await job.register('fridge', 'unassigned', accountID)
	await job.updateStatus('fridge', 'resolved', accountID)
	const status = await job.getStatus('fridge', accountID)
	test.is(status, 'resolved')
	account.close()
	job.close()
})

test('GET JOBS : jobs not found', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	await account.register('doej', 'password', 'customer', 'doej@gmail.com')
	const accountID = await account.getID('doej')
	const result = await job.getJobs(accountID)
	test.is(result, 'No jobs found for customer with customerID "1"', 'incorrect error message')
	account.close()
	job.close()
})

test('GET JOBS : jobs retrieval', async test => {
	test.plan(1)
	const account = await new Accounts()
	const job = await new Jobs()
	await account.register('doej', 'password', 'customer', 'doej@gmail.com')
	const accountID = await account.getID('doej')

	await job.register('fridge', 'unassigned', accountID)
	const value = await job.getJobs(accountID)
	const mockValue = 'fridge'
	test.is(value[0].job, mockValue)
})
