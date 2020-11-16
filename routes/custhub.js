
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

router.get('/', async ctx => {
	const account = await new Accounts(dbName)
	const job = await new Jobs(dbName)
	const currentUserName = ctx.session.user
	const currentUserID = await account.getID(currentUserName)
	const jobs = await job.getJobs(currentUserID)
	if(!jobs.includes('No jobs found for customer with customerID "')) {
		for(const aJob of jobs) {
			aJob.status = await job.getStatus(aJob.job, currentUserID)
		}
		ctx.hbs.record = jobs
		ctx.hbs.record.status = true
	} else ctx.hbs.record = jobs
	try {
		await ctx.render('custhub', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

export default router
