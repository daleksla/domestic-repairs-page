
import test from 'ava'
import Accounts from '../modules/accounts.js'
import TechDetails from '../modules/techniciandetails.js'

// techID, phone, address
//make 3 test to test registration - the three missing details
test('REGISTER : error if blank techID', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		await tD.register('', 456447895, '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank phone number', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		await tD.register(ID, '', '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : error if blank address', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		await tD.register(ID, 456447895, '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

test('REGISTER : success', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		const value = await tD.register(ID, 456447895, '16 Barneby Lane')
		test.is(value, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
	}
})

//make a test to test getDetails - if techID is missing
test('GET DETAILS : error if blank techID', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		await tD.register(ID, 456447895, '16 Barneby Road')
		await tD.getDetails('')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
	}
})

//make test to see if getDetails works
test('GET DETAILS : success ', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		await tD.register(ID, 456447895, '16 Barneby Road')
		const value = await tD.getDetails(ID)
		const obj =
		{
			address: '16 Barneby Road',
			phoneNumber: 456447895,
		}
		test.deepEqual(value, obj)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
	}
})
