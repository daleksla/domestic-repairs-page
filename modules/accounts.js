
/** @module Accounts */

import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'

const saltRounds = 10

/**
 * Accounts
 * ES6 module that handles registering accounts and logging in.
 */
class Accounts {
	/**
   * Create an account object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS users\
				(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT, type TEXT, email TEXT);'
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @param {String} type the account type
	 * @param {String} email the chosen email
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, type, email) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		if( !(type === 'customer' || type === 'technician') ) throw new Error(`Account type "${type}" is invalid`)
		let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
		const data = await this.db.get(sql)
		if(data.records !== 0) throw new Error(`username "${user}" already in use`)
		sql = `SELECT COUNT(id) as records FROM users WHERE email="${email}";`
		const emails = await this.db.get(sql)
		if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO users(user, pass, type, email) VALUES("${user}", "${pass}", "${type}", "${email}")`
		await this.db.run(sql)
		return true
	}
	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async login(username, password) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT pass FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		const valid = await bcrypt.compare(password, record.pass)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return true
	}
	/**
	 * checks to return the account type
	 * @param {String} username the username to check
	 * @returns {String} type of account
	 */
	async getType(username) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${username}" not found`)
		sql = `SELECT type FROM users WHERE user="${username}";`
		const object = await this.db.get(sql) //it returns an object, not value alone
		return String(object.type)
	}
	/**
	 * checks to return the username of a given (user) id
	 * @param {Number} id the id of the user to check
	 * @returns {String} name of user account
	 */
	async getUsername(id) {
		let sql = `SELECT count(id) AS count FROM users WHERE id="${id}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`id "${id}" not found`)
		sql = `SELECT user FROM users WHERE id="${id}";`
		const object = await this.db.get(sql) //it returns an object, not value alone
		return String(object.user)
	}
	/**
	 * checks to return the id of a given username
	 * @param {String} the username of an account
	 * @returns {Number} id of user account
	 */
	async getID(username) {
		let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`user "${username}" not found`)
		sql = `SELECT id FROM users WHERE user="${username}";`
		const object = await this.db.get(sql) //it returns an object, not value alone
		return Number(object.id)
	}

	async close() {
		await this.db.close()
	}
}

export default Accounts
