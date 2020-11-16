
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
id INTEGER PRIMARY KEY AUTOINCREMENT, job TEXT, status TEXT, customerID INTEGER,\
FOREIGN KEY(customerID) REFERENCES users(id)\
);'
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * registers a new user
	 * @param {String} job the chosen job name
	 * @param {String} status the state of the job
	 * @param {Number} customerID the ID of the customer requesting the job
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(job, status, customerID) {
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		if( !(status === 'unassigned' || status === 'in progress' || status === 'resolved') ) {
			throw new Error(`status "${status}" is invalid`)
		}
		let sql = `SELECT COUNT(id) AS count FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		const data = await this.db.get(sql)
		if(Number(data.count) !== 0) {//check if job with same name by same person exists
			throw new Error(`The job "${job}" for customer with customerID "${customerID}" already exists`)
		}
		sql = `INSERT INTO jobs(job, status, customerID) VALUES("${job}", "${status}", "${customerID}");`
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
		Array.from(arguments).forEach( val => {
			if(val.length === 0) throw new Error('missing field')
		})
		if( !(newStatus === 'unassigned' || newStatus === 'in progress' || newStatus === 'resolved') ) {
			throw new Error(`status "${newStatus}" is invalid`)
		}
		let sql = `SELECT count(id) AS count FROM jobs WHERE job="${job}" AND customerID=${customerID};`
		let records = await this.db.get(sql)
		if(!records.count) {
			sql = `SELECT count(id) AS new FROM jobs WHERE job="${job}";`
			records = await this.db.get(sql)
			if(!records.new) throw new Error(`job "${job}" not found`)
			else throw new Error(`customer with customerID "${customerID}" not found`)
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
