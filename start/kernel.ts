import router from '@adonisjs/core/services/router'

/**
 * Named middleware collection
 * These can be applied to routes using middleware.name()
 */
const middleware = router.named({
  logger: () => import('#middleware/logger_middleware'),
})

export { middleware }
