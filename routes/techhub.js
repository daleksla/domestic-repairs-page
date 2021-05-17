
import Router from 'koa-router'
import Jobs from '../modules/jobs.js'
import Accounts from '../modules/accounts.js'

const router = new Router({ prefix: '/techhub' })
const dbName = 'website.db'

/**
 * middleware to check current user status (ie signed in or not) & redirects to do so if otherwise
 * @param {Object} Koa Context - node's request and response objects into a single object - we'll access data from it
 */
async function checkAuth(ctx, next) {
	console.log('technician hub router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/techhub')
	await next()
}

// async function checkType(ctx, next) {
// 	console.log('technician hub router middleware')
// 	console.log(ctx.hbs)
// 	const account = await new Accounts(dbName)
// 	const accountType = await account.getType(ctx.hbs.user)
// 	if(accountType !== 'technician') return ctx.redirect("/?msg=You don't have access to this page!")
// 	await next()
// }

router.use(checkAuth)
// router.use(checkType)
/**
 * determines which job status will be shown by default
 * @param {Array} jobs array of each job & it's information
 * @returns {Array} returns array of object with default indicator
 */
async function configureJobs(jobs) {
	const accounts = await new Accounts(dbName)
	for(const aJob of jobs) {
		aJob.user = await accounts.getUsername(aJob.customerID)
	}
	return jobs
}
/**
 * collects and configures data for display on page
 * @param {Object} Koa Context - node's request and response objects into a single object - we'll access data from it
 * @returns {Object} Koa Context to be used for webpages
 */
async function initialiseJobs(ctx) {
	const job = await new Jobs(dbName)
	let jobs = await job.getJobsByStatus('unassigned')
	if(jobs !== 'No jobs found with status "unassigned"') {
		jobs = await configureJobs(jobs)
		ctx.hbs.record = jobs
		ctx.hbs.record.status = true
	} else {
		ctx.hbs.record = {}
		ctx.hbs.record.status = false
	}
	return ctx
}

/**
 * The technician hub page.
 * Function to render webpage with data when loading
 * @name Technician Hub Page
 * @route {GET} /techhub
 */
router.get('/', async ctx => {
	ctx = await initialiseJobs(ctx)
	try {
		await ctx.render('techhub', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

export default router
