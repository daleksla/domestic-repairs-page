
import Router from 'koa-router'
import Jobs from '../modules/jobs.js'
import Accounts from '../modules/accounts.js'
import TechDetails from '../modules/techniciandetails.js'

const router = new Router()
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('customer hub router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/custhub')
	await next()
}

router.use(checkAuth)

router.get('/custhub/reportIssue/relevantTechs', async ctx => {
	const td = await new TechDetails(dbName)
	const acc = await new Accounts(dbName)
	try {
		const id = await acc.getID(ctx.session.user)
		const appliance = ctx.request.body.type
		const allTechnicians = await acc.getAccounts('technician')
		//loop through all technicians to see if appliances are true for them, shove into array
		//get their information
		//set ctx.hbs.record.status as true
		//save to ctx.hbs.records
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		//ctx.hbs.record.status = false, will mean no techs can help
	} finally {
		await ctx.render('relevantTechs', ctx.hbs) //send data to website
		acc.close()
		td.close()
	}
})

export default router
