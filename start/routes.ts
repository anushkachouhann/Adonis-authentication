import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const NotesController = () => import('#controllers/notes_controller')


// Health check route
router.get('/', async () => {
  return { message: 'Notes API is running!', version: '1.0.0' }
})

// Auth routes (public)
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

// Auth routes (protected)
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout'])
    router.get('/me', [AuthController, 'me'])
  })
  .prefix('/auth')
  .use(middleware.auth())

// Notes routes (protected - user's own notes)
router
  .group(() => {
    router.get('/', [NotesController, 'index'])
    router.get('/:id', [NotesController, 'show'])
    router.post('/', [NotesController, 'store'])
    router.put('/:id', [NotesController, 'update'])
    router.delete('/:id', [NotesController, 'destroy'])
  })
  .prefix('/notes')
  .use([middleware.auth(), middleware.logger()])

// Admin routes (protected - admin only)
router
  .group(() => {
    router.get('/notes', [NotesController, 'adminIndex'])
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.role({ roles: ['admin'] })])
