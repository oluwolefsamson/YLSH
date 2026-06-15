const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const users = [] // replace with DB model

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const exists = users.find((u) => u.email === email)
    if (exists) return res.status(409).json({ message: 'Email already in use' })

    const hashed = await bcrypt.hash(password, 10)
    const user = { id: Date.now().toString(), name, email, password: hashed, role: 'user' }
    users.push(user)

    const token = signToken(user.id)
    res.status(201).json({ token, user: { id: user.id, name, email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = users.find((u) => u.email === email)
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken(user.id)
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

exports.logout = (_req, res) => res.json({ message: 'Logged out' })

exports.me = (req, res) => res.json({ user: req.user })
