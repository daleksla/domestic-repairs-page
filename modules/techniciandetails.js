
/** @module TechDetails */

import sqlite from 'sqlite-async'
import Accounts from './accounts.js'

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
address TEXT, phoneNumber INTEGER, techID INTEGER,\
FOREIGN KEY(techID) REFERENCES users(id)\
);'
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * register technician details
	 * @param {Number} techID the ID of the account
	 * @param {Number} phone the phone number of the technician
	 * @param {String} address the address of the technician
	 * @returns {Boolean} if no errors occur
	 */
	async register(techID, phone, address) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `INSERT INTO techDetails(techID, phoneNumber, address) VALUES(${techID}, ${phone}, "${address}")`
		await this.db.run(sql)
		return true
	}
	/**
	 * retrieves technician details
	 * @param {Number} techID the ID of the account
	 * @returns {Object} returns an object storing phone number and address
	 */
	async getDetails(techID) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		const sql = `SELECT address, phoneNumber FROM techDetails WHERE id=${techID};`
		const object = await this.db.get(sql) //it returns an object, not value alone
		return object
	}

	async close() {
		await this.db.close()
	}
}

export default TechDetails
