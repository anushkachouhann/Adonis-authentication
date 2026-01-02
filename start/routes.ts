import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const NotesController = () => import('#controllers/notes_controller')

// Health check route
router.get('/', async () => {
  return { message: 'Notes API is running!', version: '1.0.0' }
})

// Notes CRUD routes with logger middleware
router
  .group(() => {
    router.get('/', [NotesController, 'index'])       // GET all notes
    router.get('/:id', [NotesController, 'show'])     // GET single note
    router.post('/', [NotesController, 'store'])      // CREATE note
    router.put('/:id', [NotesController, 'update'])   // UPDATE note
    router.delete('/:id', [NotesController, 'destroy']) // DELETE note
  })
  .prefix('/notes')
  .use(middleware.logger())
