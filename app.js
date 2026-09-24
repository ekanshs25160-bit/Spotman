import express, { urlencoded } from 'express'
import folderRouter from './src/routes/folder.routes.js'
import authRouter from './src/routes/auth.route.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/folders',folderRouter)
app.use('/auth',authRouter)

export default app