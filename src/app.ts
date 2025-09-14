import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import router from './routes'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5005

app.use(express.json())
app.use(morgan('dev'))

app.use('/api', router)

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to PhishEye Heuristics API"
    })
})

// Error handler middleware 
app.use(notFoundHandler)
app.use(errorHandler)


app.listen(PORT, () => {
    console.info(`🚀 PhishEye Heuristics API running on http://localhost:${PORT}`)
})