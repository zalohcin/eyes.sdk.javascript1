require('securerandom')

class Refer
  attr_reader :store, :relation
  REF_ID = 'applitools-ref-id'.freeze

  def initialize()
    @store = {}
    @relation = {}
  end

  def ref(value, parentRef = nil)
    _ref = SecureRandom.uuid
    store[_ref] = value
    if (parentRef)
      childRefs = relation[parentRef[:REF_ID]]
      if (!childRefs)
        childRefs = []
        childRefs.push(_ref)
        relation[parentRef[REF_ID]] = childRefs
      else
        childRefs.push(_ref)
      end
    end
    {REF_ID => _ref}
  end

  def isRef(ref)
    !!ref[REF_ID]
  end

  def deref(ref)
    isRef(ref) ? store[ref[REF_ID]] : ref
  end
  
  def destroy(ref)
    return if (!isRef(ref))
    childRefs = relation[ref[REF_ID]]
    childRefs.each{|childRef| destroy(childRef)} if childRefs
    store.delete(ref[REF_ID])
  end
end
