import express, { urlencoded } from 'express'
import folderRouter from './src/routes/folder.routes.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/folders',folderRouter)

export default app