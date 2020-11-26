
/** @module Jobs */

import sqlite from 'sqlite-async'
import Accounts from './accounts.js'

/**
 * Jobs
 * ES6 module that stores all jobs & associated information.
 */
class Jobs {
	/**
   * Create a jobs object
   * @param {String} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			await new Accounts()
			const sql = 'CREATE TABLE IF NOT EXISTS jobs(\
id INTEGER PRIMARY KEY AUTOINCREMENT, job TEXT,\
status TEXT, age TEXT, manufacturer TEXT, fault TEXT, customerID INTEGER,\
FOREIGN KEY(customerID) REFERENCES users(id)\
);'
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * checks if any of the functions parameters are blank
	 * @param {Array} the values given to the function
	 * @returns {Boolean} if no value was left blank
	 */
	checkMissingParameters(values) {
		for(const value of values) {
			if(value.length === 0) throw new Error('missing field')
		}
		return true
	}
	/**
	 * checks if the status is of a valid type
	 * @param {String} status the status of the job
	 * @returns {Boolean} if status is valid
	 */
	checkStatus(status) {
		if( !(status === 'unassigned' || status === 'in progress' || status === 'resolved') ) {
			throw new Error(`status "${status}" is invalid`)
		} else return true
	}
	/**
	 * registers a new user
	 * @param {String} job the chosen job name
	 * @param {String} status the state of the job
	 * @param {Number} age the age of appliance
	 * @param {String} manufacturer the manufacturer of said appliance
	 * @param {String} fault the issue with said appliance
	 * @param {Number} customerID the ID of the customer requesting the job
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(job, status, report, customerID) {//age, manufacturer, fault = report[] array
		const one = 1
		const age = report[one - one]
		const manufacturer = report[one]
		const fault = report[one + one]
		this.checkMissingParameters([job, status, age, manufacturer, fault, customerID])
		this.checkStatus(status)
		const maxAge = 10
		const minAge = 0
		if(age > maxAge || age < minAge) throw new Error(`age "${age}" is invalid`)
		const sql = `INSERT INTO jobs(job, status, age, manufacturer, fault, customerID)\
VALUES("${job}", "${status}", "${age}", "${manufacturer}", "${fault}", "${customerID}");`
		await this.db.run(sql)
		return true
	}
	/**
	 * checks to return the job status
	 * @param {String} job the job name to check
	 * @param {Number} customerID the ID of the customer to check
	 * @returns {String} status of the job
	 */
	async getStatus(job, customerID) {
		let sql = `SELECT count(id) AS count FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		let records = await this.db.get(sql)
		if(!records.count) {
			sql = `SELECT count(id) AS count FROM jobs WHERE job="${job}";`
			records = await this.db.get(sql)
			if(!records.count) {
				throw new Error(`job "${job}" not found`)
			} else {
				throw new Error(`customer with customerID "${customerID}" not found`)
			}
		}
		sql = `SELECT status FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		const object = await this.db.get(sql) //it returns an object, not value alone
		return String(object.status)
	}
	/**
	 * checks to return the job status
	 * @param {String} job the job name to check
	 * @param {Number} customerID the ID of the customer to check
	 * @returns {Number} id of the job
	 */
	async getID(job, customerID) {
		let sql = `SELECT count(id) AS count FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		let records = await this.db.get(sql)
		if(!records.count) {
			sql = `SELECT count(id) AS count FROM jobs WHERE job="${job}";`
			records = await this.db.get(sql)
			if(!records.count) {
				throw new Error(`job "${job}" not found`)
			} else {
				throw new Error(`customer with customerID "${customerID}" not found`)
			}
		}
		sql = `SELECT id FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		const object = await this.db.get(sql) //it returns an object, not value alone
		return object.id
	}
	/**
	 * checks to return the job status
	 * @param {Number} customerID the ID of the customer to check
	 * @returns {Object} the jobs associated with that customerID
	 */
	async getJobs(customerID) {
		let sql = `SELECT count(id) AS count FROM jobs WHERE customerID=${customerID};`
		const records = await this.db.get(sql)
		if(!records.count) {
			return `No jobs found for customer with customerID "${customerID}"`
		}
		sql = `SELECT job FROM jobs WHERE customerID=${customerID};`
		const object = await this.db.all(sql) //it returns an object, not value alone
		return object
	}
	/**
	 * checks to return the job status
	 * @param {String} job the job name to check
	 * @param {String} status to be updated
	 * @param {String} customerID who's job this pertains to
	 * @returns {Boolean} returns true if the job has been updated
	 */
	async updateStatus(job, newStatus, customerID) {
		this.checkMissingParameters(arguments)
		this.checkStatus(newStatus)
		let sql = `SELECT count(id) AS count FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		let records = await this.db.get(sql)
		if(!records.count) {
			sql = `SELECT count(id) AS new FROM jobs WHERE job="${job}";`
			records = await this.db.get(sql)
			if(!records.new) throw new Error(`job "${job}" not found`)
			throw new Error(`customer with customerID "${customerID}" not found`)
		}
		sql = `UPDATE jobs SET status="${newStatus}" WHERE job="${job}" AND customerID=${customerID};`
		await this.db.run(sql)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export default Jobs
