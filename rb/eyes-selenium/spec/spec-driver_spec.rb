require('selenium-webdriver')
require('webdrivers/chromedriver')
require_relative('../lib/spec-driver')

describe 'spec-driver' do
  before(:all) do
    options = ::Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    @driver = ::Selenium::WebDriver.for :chrome, options: options
    @url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
    @driver.get @url
  end
  after(:all) do
    @driver.quit
  end
  it('isEqualElements(element, element)') do
    el1 = @driver.find_element(:css, 'div')
    expect(::Applitools::SpecDriver.isEqualElements(@driver, el1, el1)).to eq(true)
  end
  it('isEqualElements(element1, element2)') do
    el1 = @driver.find_element(:css, 'div')
    el2 = @driver.find_element(:css, 'h1')
    expect(::Applitools::SpecDriver.isEqualElements(@driver, el1, el2)).to eq(false)
  end
  it('executeScript') do
    args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
    expected = @driver.execute_script('return arguments', *args)
    result = ::Applitools::SpecDriver.executeScript(@driver, 'return arguments', *args)
    expect(result).to eq(expected)
  end
  it('mainContext') do
    begin
      mainDocument = @driver.find_element(:css, 'html')
      @driver.switch_to.frame(@driver.find_element(:css, '[name="frame1"]'))
      @driver.switch_to.frame(@driver.find_element(:css, '[name="frame1-1"]'))
      frameDocument = @driver.find_element(:css, 'html')
      expect(::Applitools::SpecDriver.isEqualElements(@driver, mainDocument, frameDocument)).to eq(false)
      ::Applitools::SpecDriver.mainContext(@driver)
      resultDocument = @driver.find_element(:css, 'html')
      expect(::Applitools::SpecDriver.isEqualElements(@driver, resultDocument, mainDocument)).to eq(true)
    ensure
      @driver.switch_to.default_content
    end
  end
  it('parentContext') do
    begin
      @driver.switch_to.frame(@driver.find_element(:css, '[name="frame1"]'))
      parentDocument = @driver.find_element(:css, 'html')
      @driver.switch_to.frame(@driver.find_element(:css, '[name="frame1-1"]'))
      frameDocument = @driver.find_element(:css, 'html')
      expect(::Applitools::SpecDriver.isEqualElements(@driver, parentDocument, frameDocument)).to eq(false)
      ::Applitools::SpecDriver.parentContext(@driver)
      resultDocument = @driver.find_element(:css, 'html')
      expect(::Applitools::SpecDriver.isEqualElements(@driver, resultDocument, parentDocument)).to eq(true)
    ensure
      @driver.switch_to.default_content
    end
  end
  it('childContext') do
    begin
      element = @driver.find_element(:css, '[name="frame1"]')
      @driver.switch_to.frame(element)
      expectedDocument = @driver.find_element(:css, 'html')
      @driver.switch_to.default_content
      ::Applitools::SpecDriver.childContext(@driver, element)
      resultDocument = @driver.find_element(:css, 'html')
      expect(::Applitools::SpecDriver.isEqualElements(@driver, resultDocument, expectedDocument)).to eq(true)
    ensure
      @driver.switch_to.default_content
    end
  end
  it('findElement css') do
    expected = @driver.find_element(:css, 'div')
    actual = ::Applitools::SpecDriver.findElement(@driver, 'div')
    expect(::Applitools::SpecDriver.isEqualElements(@driver, expected, actual)).to eq(true)
  end
  it('findElement xpath') do
    skip
  end
  it('findElement eyes-selectors') do
    skip
  end
  it('findElements') do
    expected = @driver.find_elements(:css, 'div')
    actual = ::Applitools::SpecDriver.findElements(@driver, 'div')
    expect(::Applitools::SpecDriver.isEqualElements(@driver, expected, actual)).to eq(true)
  end
  it('getTitle') do
    expected = @driver.title
    result = ::Applitools::SpecDriver.getTitle(@driver)
    expect(result).to eq(expected)
  end
  it('getUrl') do
    result = ::Applitools::SpecDriver.getUrl(@driver)
    expect(result).to eq(@url)
  end
  it('isMobile') do
    result = ::Applitools::SpecDriver.getDriverInfo(@driver)
    expect(result[:isMobile]).to eq(false)
  end
  it('getPlatformName') do
    result = ::Applitools::SpecDriver.getDriverInfo(@driver)
    expect(result[:platformName]).to_not be_nil
  end
  it('takeScreenshot') do
    skip
  end
end

describe('onscreen desktop') do
  before(:all) do
    options = Selenium::WebDriver::Chrome::Options.new
    @driver = Selenium::WebDriver.for :chrome, options: options
    @driver.get 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  end
  after(:all) do
    @driver.quit
  end
  it('getWindowRect') do
    rect = @driver.manage.window.rect
    result = ::Applitools::SpecDriver.getWindowRect(@driver)
    expect(result).to eq(rect)
  end
  it('setWindowRect') do
    input = {x: 50, y: 50, width: 510, height: 511}
    expected = {x: 50, y: 50, width: 510, height: 511}
    ::Applitools::SpecDriver.setWindowRect(@driver, input)
    rect = @driver.manage.window.rect
    expect(rect.height).to eq(expected[:height])
    expect(rect.width).to eq(expected[:width])
    expect(rect.x).to eq(expected[:x])
    expect(rect.y).to eq(expected[:y]) 
  end
  it('setWindowRect({x, y})') do
    input = {x: 100, y: 100}
    expected = {x: 100, y: 100, width: 510, height: 511}
    ::Applitools::SpecDriver.setWindowRect(@driver, input)
    rect = @driver.manage.window.rect
    expect(rect.height).to eq(expected[:height])
    expect(rect.width).to eq(expected[:width])
    expect(rect.x).to eq(expected[:x])
    expect(rect.y).to eq(expected[:y]) 
  end
  it('setWindowRect({width, height})') do
    input = {width: 551, height: 552}
    expected = {x: 100, y: 100, width: 551, height: 552}
    ::Applitools::SpecDriver.setWindowRect(@driver, input)
    rect = @driver.manage.window.rect
    expect(rect.height).to eq(expected[:height])
    expect(rect.width).to eq(expected[:width])
    expect(rect.x).to eq(expected[:x])
    expect(rect.y).to eq(expected[:y]) 
  end
end

#describe('mobile driver (@mobile)', async () => {
#  before(async () => {
#    ;[driver, destroyDriver] = await spec.build({browser: 'chrome', device: 'Pixel 3a XL'})
#  })
#
#  after(async () => {
#    await destroyDriver()
#  })
#
#  it('isMobile()', isMobile({expected: true}))
#  it('getDeviceName()', getDeviceName({expected: 'Google Pixel 3a XL GoogleAPI Emulator'}))
#  it('getPlatformName()', getPlatformName({expected: 'Android'}))
#  it('isNative()', isNative({expected: false}))
#  it('getOrientation()', getOrientation({expected: 'portrait'}))
#  it('getPlatformVersion()', getPlatformVersion({expected: '10'}))
#})
