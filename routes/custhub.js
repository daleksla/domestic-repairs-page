
import Router from 'koa-router'
import Accounts from '../modules/accounts.js'
import Jobs from '../modules/jobs.js'

const router = new Router({ prefix: '/custhub' })
const dbName = 'website.db'

/**
 * middleware to check current user status (ie signed in or not) & redirects to do so if otherwise
 * @param {Object} Koa Context - node's request and response objects into a single object - we'll access data from it
 */
async function checkAuth(ctx, next) {
	console.log('customer hub router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/custhub')
	await next()
}

// async function checkType(ctx, next) {
// 	console.log('customer hub router middleware')
// 	console.log(ctx.hbs)
// 	if(ctx.hbs.isCustomer !== true) return ctx.redirect("/?msg=You don't have access to this page!")
// 	await next()
// }

router.use(checkAuth)
// router.use(checkType)

/**
 * determines which job status will be shown by default
 * @param {Array} jobs array of each job & it's information
 * @param {Number} currentUserID the currentUserID password
 * @returns {Array} returns array of object with default indicator
 */
async function configureJobs(jobs, currentUserID) {
	const job = await new Jobs(dbName)
	for(const aJob of jobs) {
		const status = await job.getStatusByID(aJob.id, currentUserID)
		if(status === 'unassigned') {
			aJob.status1 = 'selected'
			aJob.status2 = aJob.status3 = ''
		} else if(status === 'in progress') {
			aJob.status2 = 'selected'
			aJob.status1 = aJob.status3 = ''
		} else if(status === 'resolved') {
			aJob.status3 = 'selected'
			aJob.status1 = aJob.status2 = ''
		}
	}
	return jobs
}
/**
 * collects and configures data for display on page
 * @param {Object} Koa Context - node's request and response objects into a single object - we'll access data from it
 * @returns {Object} Koa Context to be used for webpages
 */
async function initialiseJobs(ctx) {
	const account = await new Accounts(dbName)
	const job = await new Jobs(dbName)
	const currentUserID = await account.getID(ctx.session.user)
	let jobs = await job.getJobs(currentUserID)
	if(!jobs.includes('No jobs found for customer with customerID "')) {
		jobs = await configureJobs(jobs, currentUserID)
		ctx.hbs.record = jobs
		ctx.hbs.record.status = true
		ctx.hbs.record.job = true
	} else ctx.hbs.record = jobs
	return ctx
}

/**
 * The customer hub page.
 * Function to render webpage with data when loading
 * @name Customer Hub Page
 * @route {GET} /custhub
 */
router.get('/', async ctx => {
	ctx = await initialiseJobs(ctx)
	try {
		await ctx.render('custhub', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The customer hub page.
 * Function to deal with form submitted from webpage
 * @name Customer Hub Page
 * @route {POST} /custhub
 */
router.post('/', async ctx => {
	const account = await new Accounts(dbName)
	const jobs = await new Jobs(dbName)
	try {
		const currentUserName = ctx.session.user
		const currentUserID = await account.getID(currentUserName)
		//below we call a function to update our code
		await jobs.updateStatusByID(ctx.request.body.job, ctx.request.body.status, currentUserID)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
	} finally {
		ctx.redirect('/custhub?msg=changes saved!') //we refresh the page to show updated data
		jobs.close()
	}
})

export default router
