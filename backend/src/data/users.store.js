const store = []

module.exports = {
  getAll: () => store,
  findById: (id) => store.find((u) => u.id === id),
  update: (id, data) => {
    const idx = store.findIndex((u) => u.id === id)
    if (idx === -1) return null
    store[idx] = { ...store[idx], ...data, id }
    return store[idx]
  },
  remove: (id) => {
    const idx = store.findIndex((u) => u.id === id)
    if (idx === -1) return false
    store.splice(idx, 1)
    return true
  },
}
