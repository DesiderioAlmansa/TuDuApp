import { request, type Request, type Response } from "express"
import Note, { INote } from "../models/Note"
import colors from 'colors'
import { Types } from "mongoose"

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        try {
            const { content } = req.body
            const note = new Note()
            note.content = content
            note.createdBy = req.user.id
            note.task = req.task.id

            req.task.notes.push(note.id)

            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota creada')
        } catch (error) {
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id})
            
            res.json(notes)
        } catch (error) {
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        try {
            const { noteId } = req.params
            const note = await Note.findById(noteId)
            if(!note){
                const error = new Error(`No se encontró la nota`)
                return res.status(404).json({error: error.message})
            }
            if(note.createdBy.toString() !== req.user.id.toString()){
                const error = new Error(`Acción no autorizada`)
                return res.status(401).json({error: error.message})
            }
            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())
            await Promise.allSettled([req.task.save(), note.deleteOne()]) 
            res.send('Nota eliminada')
        } catch (error) {
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

}