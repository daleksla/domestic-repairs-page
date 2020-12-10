
import Router from 'koa-router'
import Jobs from '../modules/jobs.js'
import Accounts from '../modules/accounts.js'

const router = new Router()
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('customer hub report issue router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/custhub/reportIssue')
	await next()
}

router.use(checkAuth)

router.get('/custhub/reportIssue', async ctx => await ctx.render('reportIssue'))

router.post('/custhub/reportIssue', async ctx => {
	const jobs = await new Jobs(dbName)
	const acc = await new Accounts(dbName)
	try {
		const id = await acc.getID(ctx.session.user)
		const c = ctx ; ctx.session.item = ctx.request.body.type
		const v=[c.request.body.type,[c.request.body.age,c.request.body.manufacturer,c.request.body.description]]
		const state = 'unassigned'
		const y = 1
		await jobs.register(v[y-y], state, v[y], id)
		ctx.redirect('/custhub/reportIssue/relevantTechs')
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
	} finally {
		acc.close()
		jobs.close()
	}
})

export default router
