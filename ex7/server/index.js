import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db, initDB } from './db.js'

const app = express()
const PORT = 3333
const JWT_SECRET = 'SECRET_KEY_EX7'

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token not provided' })
  }
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' })
  }
  next()
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username?.trim()) return res.status(400).json({ error: 'Username is required' })
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' })
  if (!password?.trim()) return res.status(400).json({ error: 'Password is required' })

  if (await db.emailExists(email.trim())) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const hashed = bcrypt.hashSync(password, 10)
  const user = await db.createUser({ username: username.trim(), email: email.trim(), password: hashed })
  return res.status(201).json({ token: generateToken(user), user })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  const user = await db.getUserByEmail(email.trim())
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Incorrect email or password' })
  }

  const { password: _, ...safe } = user
  return res.json({ token: generateToken(user), user: safe })
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await db.getUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password: _, ...safe } = user
  return res.json(safe)
})

app.put('/api/auth/me', authMiddleware, async (req, res) => {
  const { username, email, password } = req.body
  const user = await db.getUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  if (email?.trim() && email.trim() !== user.email && await db.emailExists(email.trim(), user.id)) {
    return res.status(409).json({ error: 'Email already in use' })
  }

  const updated = await db.updateUser(user.id, {
    username: username?.trim() || user.username,
    email: email?.trim() || user.email,
    password: password?.trim() ? bcrypt.hashSync(password, 10) : user.password,
  })
  return res.json(updated)
})

app.delete('/api/auth/me', authMiddleware, async (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ error: 'Administrators cannot delete their own account' })
  }
  await db.deleteUser(req.user.id)
  return res.json({ message: 'Account deleted successfully' })
})

app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  return res.json(await db.getAllUsers())
})

app.post('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
  const { username, email, password, role } = req.body
  if (!username?.trim()) return res.status(400).json({ error: 'Username is required' })
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' })
  if (!password?.trim()) return res.status(400).json({ error: 'Password is required' })

  if (await db.emailExists(email.trim())) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const hashed = bcrypt.hashSync(password, 10)
  const user = await db.createUser({
    username: username.trim(),
    email: email.trim(),
    password: hashed,
    role: role === 'admin' ? 'admin' : 'user',
  })
  return res.status(201).json(user)
})

app.put('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  const user = await db.getUserById(id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const { username, email, password, role } = req.body
  if (email?.trim() && email.trim() !== user.email && await db.emailExists(email.trim(), id)) {
    return res.status(409).json({ error: 'Email already in use' })
  }

  const updated = await db.updateUser(id, {
    username: username?.trim() || user.username,
    email: email?.trim() || user.email,
    role: role === 'admin' ? 'admin' : role === 'user' ? 'user' : user.role,
    password: password?.trim() ? bcrypt.hashSync(password, 10) : user.password,
  })
  return res.json(updated)
})

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const id = parseInt(req.params.id)
  if (id === req.user.id) {
    return res.status(403).json({ error: 'Cannot delete your own account' })
  }
  if (!await db.deleteUser(id)) return res.status(404).json({ error: 'User not found' })
  return res.json({ message: 'User deleted successfully' })
})

initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => { console.error('Failed to connect to MySQL:', err.message); process.exit(1) })
