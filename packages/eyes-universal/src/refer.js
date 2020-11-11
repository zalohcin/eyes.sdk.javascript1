const uuid = require('uuid')

function makeRefer() {
  const store = new Map()
  const relation = new Map()

  return {ref, deref, destroy}

  function ref(value, parentRef) {
    const ref = uuid.v4()
    store.set(ref, value)
    if (parentRef) {
      let childRefs = relation.get(parentRef)
      if (!childRefs) {
        childRefs = new Set()
        relation.set(parentRef, childRefs)
      }
      childRefs.add(ref)
    }
    return ref
  }

  function deref(ref) {
    return store.get(ref)
  }

  function destroy(ref) {
    const childRefs = relation.get(ref)
    childRefs.forEach(childRef => this.destroy(childRef))
    store.delete(ref)
  }
}

module.exports = makeRefer
