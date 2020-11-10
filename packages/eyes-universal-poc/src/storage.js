const uuid = require('uuid')

class Storage {
  constructor() {
    this._storage = new Map()
    this._children = new Map()
  }

  ref(value, parentRef) {
    const ref = uuid.v4()
    this._storage.set(ref, value)
    if (parentRef) {
      let children = this._children.get(parentRef)
      if (!children) {
        children = new Set()
        this._children.set(parentRef, children)
      }
      children.add(ref)
    }
    return ref
  }

  deref(ref) {
    return this._storage.get(ref)
  }

  destroy(ref) {
    const children = this._children.get(ref)
    children.forEach(childRef => this.destroy(childRef))
    this._storage.delete(ref)
  }
}

module.exports = Storage
