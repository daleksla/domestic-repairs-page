
import Router from 'koa-router'

import publicRouter from './public.js'
import secureRouter from'./custhub.js'
import reportIssue from'./reportIssue.js'

const mainRouter = new Router()

const nestedRoutes = [publicRouter, secureRouter, reportIssue]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
