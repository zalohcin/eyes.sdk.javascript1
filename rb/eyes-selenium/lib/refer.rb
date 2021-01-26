require('securerandom')

class Refer
  attr_reader :store, :relation
  REF_ID = 'applitools-ref-id'.freeze

  def initialize()
    @store = {}
    @relation = {}
  end

  def ref(value, parentRef = nil)
    uuid = SecureRandom.uuid
    store[uuid] = value
    if (parentRef)
      childRefs = relation[parentRef[:REF_ID]]
      if (!childRefs)
        childRefs = []
        childRefs.push(uuid)
        relation[parentRef[REF_ID]] = childRefs
      else
        childRefs.push(uuid)
      end
    end
    {REF_ID => uuid}
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
