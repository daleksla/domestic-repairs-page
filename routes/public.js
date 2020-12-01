
import Router from 'koa-router'
import bodyParser from 'koa-body'

const router = new Router()
router.use(bodyParser({multipart: true}))

import Accounts from '../modules/accounts.js'
// import Jobs from '../modules/jobs.js'
const dbName = 'website.db'

/**
 * The custhub home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const acc = await new Accounts(dbName)
	try {
		// call the functions in the module
		await acc.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.type, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		acc.close()
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		await account.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.user = body.user
		const accountType = await account.getType(ctx.session.user)
		ctx = determinePath(ctx, accountType, body)[0]
		const referrer = determinePath(ctx, accountType, body)[1]
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})
/**
 * determines which webpage should run
 * @param {Object} ctx Koa context - stores data we will modify
 * @param {String} accountType account of user who logged in 
 * @returns {Array} Koa context, name of path
 */
function determinePath(ctx, accountType, body) {
	let referrer = ''
	if(accountType === 'customer') {
		referrer = body.referrer || '/custhub'
		ctx.hbs.isCustomer = true
	} else if(accountType === 'technician') {
		referrer = body.referrer || '/techhub'
		ctx.hbs.isCustomer = false
	} else throw new Error('Invalid account')
	return [ctx, referrer]
}

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

export default router
