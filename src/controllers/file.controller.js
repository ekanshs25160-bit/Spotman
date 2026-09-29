import { File } from "../models/file.model.js"

export const uploadFile = async(req,res)=>{
    const folderId = req.params.folderId
    if(!req.file){
        return res.status(400).json({error: 'Please select a file to upload'})
    }
    const {originalname,size,mimetype, path} = req.file
    const file = await File.create({
        name: originalname,
        size,
        mimeType: mimetype,
        url: path,
        folder: folderId,
        owner: req.user._id
    })
    return res.status(201).json({message: 'File uploaded successfully', file})
}

export const getFileById = async(req,res)=>{
    const {fileId} = req.params
    const file = await File.findOne({_id:fileId, owner: req.user._id})
    if(!file) {
        return res.status(404).json('File not found')
    }
    return res.status(200).json({message: 'File found successfully',file})
}

export const downloadFile = async(req,res)=>{
    const {fileId} = req.params
    const file = await File.findOne({_id:fileId, owner: req.user._id})
    if(!file) {
        return res.status(404).json('File not found')
    }
    return res.download(file.url, file.name)
}

export const deleteFile = async(req,res)=>{
    const {fileId} = req.params
    const file = await File.findOneAndDelete({_id: fileId, owner: req.user._id})
    if(!file) {
        return res.status(404).json('File not found')
    }
    return res.status(200).json({message: 'File is deleted successfully'})
}