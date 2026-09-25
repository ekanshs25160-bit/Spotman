import express, { urlencoded } from 'express'
import folderRouter from './src/routes/folder.routes.js'
import authRouter from './src/routes/auth.route.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from './src/config/passport.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            monogoUrl: process.env.MONGO_URI,
            dbName: 'file_uploader',
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 1000*60*60*24*7
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/folders',folderRouter)
app.use('/auth',authRouter)


export default app