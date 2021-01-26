require_relative('../lib/refer')

describe 'refer' do
  before(:each) do
    @refer = ::Applitools::Refer.new
  end
  it('should store an entry') do
    input = {:blah => 'blah'}
    @refer.ref(input)
    expect(@refer.store.values.first).to eq(input)
  end
  it('should return a server compatible element reference') do
    input = {:blah => 'blah'}
    result = @refer.ref(input)
    expect(result.keys.first).to eq(::Applitools::Refer::REF_ID)
    expect(result.values.first).to_not be_nil
  end
  it('should track element relation') do
    parentRef = @refer.ref({:a => 'a'})
    @refer.ref({:b => 'b'}, parentRef)
    expect(@refer.relation.keys.first).to eq(parentRef.values.first)
  end
  it('should confirm ref identity') do
    ref = @refer.ref({:a => 'a'})
    expect(@refer.isRef(ref)).to eq(true)
    expect(@refer.isRef({})).to eq(false)
  end
  it('should return the original value') do
    input = {:a => 'a'}
    ref = @refer.ref(input)
    expect(@refer.deref(ref)).to eq(input)
    expect(@refer.deref({})).to eq({})
  end
  it('should destroy a ref') do
    parentRef = @refer.ref({:a => 'a'})
    @refer.ref({:b => 'b'}, parentRef)
    @refer.destroy(parentRef)
    expect(@refer.store.keys.include?(parentRef.keys.first)).to eq(false)
  end
end
