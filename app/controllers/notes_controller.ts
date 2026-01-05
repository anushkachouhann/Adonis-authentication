import type { HttpContext } from '@adonisjs/core/http'
import { createNoteValidator, updateNoteValidator } from '#validators/note'
import noteService from '#services/note_service'

export default class NotesController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    const notes = await noteService.getAllByUser(user.id)

    return response.ok({
      success: true,
      data: notes,
    })
  }

  async adminIndex({ response }: HttpContext) {
    const notes = await noteService.getAll()

    return response.ok({
      success: true,
      data: notes,
    })
  }

  async show({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const note = await noteService.findByIdForUser(Number(params.id), user.id)

    if (!note) {
      return response.notFound({
        success: false,
        message: 'Note not found',
      })
    }

    return response.ok({
      success: true,
      data: note,
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createNoteValidator)
    const note = await noteService.create(user.id, data)

    return response.created({
      success: true,
      message: 'Note created successfully',
      data: note,
    })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const note = await noteService.findByIdForUser(Number(params.id), user.id)

    if (!note) {
      return response.notFound({
        success: false,
        message: 'Note not found',
      })
    }

    const data = await request.validateUsing(updateNoteValidator)
    const updated = await noteService.update(note, data)

    return response.ok({
      success: true,
      message: 'Note updated successfully',
      data: updated,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const note = await noteService.findByIdForUser(Number(params.id), user.id)

    if (!note) {
      return response.notFound({
        success: false,
        message: 'Note not found',
      })
    }

    await noteService.delete(note)

    return response.ok({
      success: true,
      message: 'Note deleted successfully',
    })
  }
}
