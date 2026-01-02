import type { HttpContext } from '@adonisjs/core/http'
import { createNoteValidator, updateNoteValidator } from '#validators/note'

// Simple in-memory storage for notes
interface Note {
  id: number
  title: string
  content: string
  createdAt: Date
}

let notes: Note[] = []
let nextId = 1

export default class NotesController {
  /**
   * GET /notes - Get all notes
   */
  async index({ response }: HttpContext) {
    return response.ok({
      success: true,
      data: notes,
    })
  }

  /**
   * GET /notes/:id - Get single note
   */
  async show({ params, response }: HttpContext) {
    const note = notes.find((n) => n.id === Number(params.id))

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

  /**
   * POST /notes - Create new note
   */
  async store({ request, response }: HttpContext) {
    // Validate request body using VineJS
    const data = await request.validateUsing(createNoteValidator)

    const note: Note = {
      id: nextId++,
      title: data.title,
      content: data.content,
      createdAt: new Date(),
    }

    notes.push(note)

    return response.created({
      success: true,
      message: 'Note created successfully',
      data: note,
    })
  }


  /**
   * PUT /notes/:id - Update a note
   */
  async update({ params, request, response }: HttpContext) {
    const noteIndex = notes.findIndex((n) => n.id === Number(params.id))

    if (noteIndex === -1) {
      return response.notFound({
        success: false,
        message: 'Note not found',
      })
    }

    // Validate request body
    const data = await request.validateUsing(updateNoteValidator)

    // Update only provided fields
    if (data.title) notes[noteIndex].title = data.title
    if (data.content) notes[noteIndex].content = data.content

    return response.ok({
      success: true,
      message: 'Note updated successfully',
      data: notes[noteIndex],
    })
  }

  /**
   * DELETE /notes/:id - Delete a note
   */
  async destroy({ params, response }: HttpContext) {
    const noteIndex = notes.findIndex((n) => n.id === Number(params.id))

    if (noteIndex === -1) {
      return response.notFound({
        success: false,
        message: 'Note not found',
      })
    }

    const deleted = notes.splice(noteIndex, 1)[0]

    return response.ok({
      success: true,
      message: 'Note deleted successfully',
      data: deleted,
    })
  }
}
