
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
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register('', 456447895, obj, '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('REGISTER : error if blank phone number', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, '', obj, '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('REGISTER : error if blank types', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		await tD.register(ID, 456447895, '', '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('REGISTER : error if blank address', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('REGISTER : error if account exists', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	let ID = 0
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		ID = await account.getID('account')
		const obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, `account with techID "${ID}" already exists`)
	} finally {
		account.close()
		tD.close()
	}
})

test('REGISTER : success', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		const value = await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		test.is(value, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
		tD.close()
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
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Road')
		await tD.getDetails('')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

//make a test to test getDetails - if techID is missing
test('GET DETAILS : error if techID has no associated details', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await tD.getDetails(1)
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no results / details for technician with ID "1"')
	} finally {
		account.close()
		tD.close()
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
		let obj={ fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		await tD.register(ID, 456447895, obj, '16 Barneby Road')
		const value = await tD.getDetails(ID)
		obj =
		{
			address: '16 Barneby Road',
			phoneNumber: 456447895,
			types: obj
		}
		test.deepEqual(value, obj)
	} catch(err) {
		test.fail(err.message)
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE ALL : error if blank techID', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		await tD.updateAll('', 456447895, obj, '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE ALL : error if blank phone number', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		await tD.updateAll(ID, '', obj, '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE ALL : error if blank types', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		await tD.updateAll(ID, 456447895, '', '16 Barneby Road')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE ALL : error if blank address', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		await tD.updateAll(ID, 456447895, obj, '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE ALL : error if account does not exist', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	const ID = 0
	try {
		const obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		await tD.updateAll(1, 456447895, obj, '16 Barneby Lane')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no records matching technician ID "1"')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE ALL : success', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		const value = await tD.updateAll(ID, 456447895, obj, '16 Barneby Lane')
		test.is(value, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE VALUE : error if blank value', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		const value = await tD.updateValue(ID, '', 'phoneNumber')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE VALUE : error if blank attribute', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		const value = await tD.updateValue(ID, 456447895, '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE VALUE : error if account does not exist', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	const ID = 0
	try {
		await tD.updateValue(1, 456447895, 'phoneNumber')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'no records matching technician ID "1"', 'incorrect error message')
	} finally {
		account.close()
		tD.close()
	}
})

test('UPDATE VALUE : success', async test => {
	test.plan(1)
	const account = await new Accounts()
	const tD = await new TechDetails()
	try {
		await account.register('account', 'password', 'technician', 'doej@gmail.com')
		const ID = await account.getID('account')
		let obj={fridge: true,microwave: true,freezer: true,boiler: true,washing_machine: true,tumble_dryer: true}
		obj = JSON.stringify(obj)
		await tD.register(ID, 456447895, obj, '16 Barneby Lane')
		const value = await tD.updateValue(ID, 456447895, 'phoneNumber')
		test.is(value, true)
	} catch(err) {
		console.log(err)
		test.fail('error thrown')
	} finally {
		account.close()
		tD.close()
	}
})
