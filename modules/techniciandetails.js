
/** @module TechDetails */

import sqlite from 'sqlite-async'

/**
 * TechDetails
 * ES6 module that handles mapping and retrieving techDetails from an account's ID.
 */
class TechDetails {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS techDetails(\
id INTEGER PRIMARY KEY AUTOINCREMENT,\
address TEXT, phoneNumber INTEGER, types TEXT,\
			techID INTEGER, FOREIGN KEY(techID) REFERENCES users(id)\
);'
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * register technician details
	 * @param {Number} techID the ID of the account
	 * @param {Number} phone the phone number of the technician
	 * @param {Object} types the types of appliance they can fix
	 * @param {String} address the address of the technician
	 * @returns {Boolean} if no errors occur
	 */
	async register(techID, phone, types, address) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT count(id) as count FROM techDetails WHERE techID=${techID};`
		const result = await this.db.get(sql) //it returns an object, not value alone
		if(result.count > 0) throw new Error(`account with techID "${techID}" already exists`)
		types = JSON.stringify(types)
		sql = `INSERT INTO techDetails(techID, phoneNumber, types, address)\
VALUES(${techID}, ${phone}, '"${types}"', "${address}")`
		await this.db.run(sql)
		return true
	}
	/**
	 * update all technician details
	 * @param {Number} techID the ID of the account
	 * @param {Number} phone the phone number of the technician
	 * @param {Object} types the types of appliance they can fix
	 * @param {String} address the address of the technician
	 * @returns {Boolean} if no errors occur
	 */
	async updateAll(techID, phone, types, address) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		types = JSON.stringify(types)
		let sql = `SELECT count(id) as count FROM techDetails WHERE techID=${techID};`
		const result = await this.db.get(sql) //it returns an object, not value alone
		if(result.count === 0) throw new Error(`no records matching technician ID "${techID}"`)
		sql = `UPDATE techDetails SET phoneNumber=${phone}, types='"${types}"', address="${address}"\
								WHERE techID=${techID}`
		await this.db.run(sql)
		return true
	}
	/**
	 * update a single technician detail
	 * @param {Number} techID the ID of the account
	 * @param {String / Number} value value to modify attribute by
	 * @param {String} attribute column name to modify
	 * @returns {Boolean} if no errors occur
	 */
	async updateValue(techID, value, attribute) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT count(id) as count FROM techDetails WHERE techID=${techID};`
		const result = await this.db.get(sql) //it returns an object, not value alone
		if(result.count === 0) throw new Error(`no records matching technician ID "${techID}"`)
		if(attribute === 'types') {
			value = JSON.stringify(value)
			sql = `UPDATE techDetails SET ${attribute}='"${value}"'	WHERE techID=${techID}`
		} else if(attribute === 'address') sql = `UPDATE techDetails SET ${attribute}="${value}" WHERE techID=${techID}`
		else sql = `UPDATE techDetails SET ${attribute}=${value} WHERE techID=${techID}`
		await this.db.run(sql)
		return true
	}
	/**
	 * retrieves technician details
	 * @param {Number} techID the ID of the account
	 * @returns {Object} returns an object storing string of appliances, phone number and address
	 */
	async getDetails(techID) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		let sql = `SELECT count(id) as count FROM techDetails WHERE techID=${techID};`
		const result = await this.db.get(sql) //it returns an object, not value alone
		if(result.count === 0) throw new Error(`no results / details for technician with ID "${techID}"`)
		sql = `SELECT address, phoneNumber, types FROM techDetails WHERE techID=${techID};`
		const object = await this.db.get(sql) //it returns an object, not value alone
		object.types = object.types.replace('"', '').replace(/"([^"]*)$/, '$1')
		object.types = object.types.replace(/\\/gi, '').replace(/'/gi, '').replace(/:/gi, ': ')
		object.types = JSON.parse(object.types)
		return object
	}

	async close() {
		await this.db.close()
	}
}

export default TechDetails
