
import Router from 'koa-router'
import Accounts from '../modules/accounts.js'
import Jobs from '../modules/jobs.js'

const router = new Router({ prefix: '/custhub' })
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('customer hub router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/custhub')
	await next()
}

router.use(checkAuth)

async function configureJobs(jobs, currentUserID) {
	const job = await new Jobs(dbName)
	for(const aJob of jobs) {
		const status = await job.getStatus(aJob.job, currentUserID)
		if(status === 'unassigned') {
			aJob.status1 = 'selected'
			aJob.status2 = aJob.status3 = false
		} else if(status === 'in progress') {
			aJob.status2 = 'selected'
			aJob.status1 = aJob.status3 = false
		} else if(status === 'in progress') {
			aJob.status3 = 'selected'
			aJob.status1 = aJob.status2 = false
		}
	}
	return jobs
}

async function initialiseJobs(ctx) {
	const account = await new Accounts(dbName)
	const job = await new Jobs(dbName)
	const currentUserID = await account.getID(ctx.session.user)
	let jobs = await job.getJobs(currentUserID)
	if(!jobs.includes('No jobs found for customer with customerID "')) {
		jobs = await configureJobs(jobs, currentUserID)
		ctx.hbs.record = jobs
		ctx.hbs.record.status = true
	} else ctx.hbs.record = jobs
	return ctx
}

router.get('/', async ctx => {
	ctx = await initialiseJobs(ctx)
	try {
		await ctx.render('custhub', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.post('/', async ctx => {
	const account = await new Accounts(dbName)
	const jobs = await new Jobs(dbName)
	try {
		const currentUserName = ctx.session.user
		const currentUserID = await account.getID(currentUserName)
		console.log(ctx.request.body.job)
		console.log(ctx.request.body.status)
		await jobs.updateStatus(ctx.request.body.job, ctx.request.body.status, currentUserID)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
	} finally {
		ctx.redirect('/custhub')
		jobs.close()
	}
})

export default router
