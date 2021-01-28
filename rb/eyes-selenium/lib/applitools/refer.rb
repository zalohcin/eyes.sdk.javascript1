require('securerandom')

module Applitools
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
      !!destructure_ref(ref)
    end

    def deref(ref)
      isRef(ref) ? store[destructure_ref(ref)] : ref
    end
    
    def destroy(ref)
      return if (!isRef(ref))
      childRefs = relation[destructure_ref(ref)]
      childRefs.each{|childRef| destroy({"#{REF_ID}": childRef})} if childRefs
      store.delete(destructure_ref(ref))
    end

    private

      def destructure_ref(ref)
        ref.keys.first.is_a?(Symbol) ? ref[:"#{REF_ID}"] : ref[REF_ID]
      end
  end
end
