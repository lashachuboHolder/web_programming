import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Message from './models/Message.js'

const app = express()
const PORT = 3334
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ex10'

app.use(cors({ origin: 'http://localhost:5175' }))
app.use(express.json())

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' })
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required' })
    if (!isValidEmail(email.trim())) return res.status(400).json({ error: 'Invalid email format' })
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' })

    const msg = await Message.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    })

    return res.status(201).json(msg)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to save message' })
  }
})

app.get('/api/messages', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    const [messages, total] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments(),
    ])

    return res.json({
      messages,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

mongoose
  .connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
