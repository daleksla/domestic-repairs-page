
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
		types = JSON.stringify(types)
		const sql = `INSERT INTO techDetails(techID, phoneNumber, types, address)\
VALUES(${techID}, ${phone}, '"${types}"', "${address}")`
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
		const sql = `SELECT address, phoneNumber, types FROM techDetails WHERE id=${techID};`
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
