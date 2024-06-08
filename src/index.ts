import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import router from './router'

const app = express()
const port = 3000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})