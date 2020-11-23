
import Router from 'koa-router'
import Jobs from '../modules/jobs.js'
import Accounts from '../modules/accounts.js'

const router = new Router()
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('customer hub router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/custhub')
	await next()
}

router.use(checkAuth)

router.get('/custhub/reportIssue', async ctx => await ctx.render('reportIssue'))

router.post('/custhub/reportIssue', async ctx => {
	const jobs = await new Jobs(dbName)
	const acc = await new Accounts(dbName)
	try {
		const id = await acc.getID(ctx.session.user)
		const v=[ctx.request.body.type,ctx.request.body.age,ctx.request.body.manufacturer,ctx.request.body.description]
		const state = 'unassigned'
		const y = 1
		const z = y++
		await jobs.register(v[y--], state, v[y], v[z], v[z++], id)
		ctx.redirect(`/custhub?msg=report for appliance "${ctx.request.body.type}" has been added`)
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
