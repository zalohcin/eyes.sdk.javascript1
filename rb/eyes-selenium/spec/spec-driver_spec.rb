require('selenium-webdriver')
require('webdrivers/chromedriver')
require_relative('../lib/spec-driver') # brings in SpecDriver

describe 'spec-driver' do
  before(:all) do
    options = Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    @driver = Selenium::WebDriver.for :chrome, options: options
    @driver.get 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  end
  after(:all) do
    @driver.quit
  end
  it('isEqualElements(element, element)') do
    el1 = @driver.find_element(:css, 'div')
    expect(SpecDriver.isEqualElements(@driver, el1, el1)).to eq(true)
  end
  it('isEqualElements(element1, element2)') do
    el1 = @driver.find_element(:css, 'div')
    el2 = @driver.find_element(:css, 'h1')
    expect(SpecDriver.isEqualElements(@driver, el1, el2)).to eq(false)
  end
  it('executeScript') do
    args = [0, 'string', {key: 'value'}, [0, 1, 2, 3]]
    expected = @driver.execute_script('return arguments', *args)
    result = SpecDriver.executeScript(@driver, 'return arguments', *args)
    expect(result).to eq(expected)
  end
  it('mainContext') do
    begin
      mainDocument = @driver.find_element(:css, 'html')
      @driver.switch_to.frame(@driver.find_element(:css, '[name="frame1"]'))
      @driver.switch_to.frame(@driver.find_element(:css, '[name="frame1-1"]'))
      frameDocument = @driver.find_element(:css, 'html')
      expect(SpecDriver.isEqualElements(@driver, mainDocument, frameDocument)).to eq(false)
      SpecDriver.mainContext(@driver)
      resultDocument = @driver.find_element(:css, 'html')
      expect(SpecDriver.isEqualElements(@driver, resultDocument, mainDocument)).to eq(true)
    ensure
      @driver.switch_to.default_content
    end
  end
  it('parentContext') do
    skip
  end
  it('childContext') do
    skip
  end
  it('findElement') do
    skip
  end
  it('findElements') do
    skip
  end
  it('getViewportSize') do
    skip
  end
  it('setViewportSize') do
    skip
  end
  it('getTitle') do
    skip
  end
  it('getUrl') do
    skip
  end
  it('getDriverInfo') do
    skip
  end
  it('takeScreenshot') do
    skip
  end
end
