const users = require('../data/users.store')

exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const start = (page - 1) * limit
  const data = users.getAll().slice(start, start + limit)
  res.json({ data, total: users.getAll().length, page, limit })
}

exports.getById = (req, res) => {
  const user = users.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

exports.update = (req, res) => {
  const user = users.update(req.params.id, req.body)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

exports.remove = (req, res) => {
  const ok = users.remove(req.params.id)
  if (!ok) return res.status(404).json({ message: 'User not found' })
  res.json({ message: 'User deleted' })
}
