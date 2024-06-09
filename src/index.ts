import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import express from 'express'
import apiRouter from './api/router'
import authRouter from './modules/auth'
import authMiddleware from './middleware/auth'
import { catchAllErrorHandler } from './handlers/errors'

dotenv.config()

const app = express()
const port = 3000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/api', authMiddleware, apiRouter)
app.use(catchAllErrorHandler)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})