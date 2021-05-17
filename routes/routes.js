
import Router from 'koa-router'

import publicRouter from './public.js'
import custhub from'./custhub.js'
import reportIssue from'./reportIssue.js'
import relevantTechnicians from './relevantTechs.js'
import techhub from './techhub.js'
import techProfile from './techProfile.js'

const mainRouter = new Router()

const nestedRoutes = [publicRouter, custhub, reportIssue, relevantTechnicians, techhub, techProfile]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
