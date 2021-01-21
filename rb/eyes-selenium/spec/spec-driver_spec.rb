require('selenium-webdriver')
require('webdrivers/chromedriver')
require_relative('../lib/spec-driver')

describe 'spec-driver' do
  before do
    options = Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    @driver = Selenium::WebDriver.for :chrome, options: options
    @driver.get 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  end
  it('isEqualElements(element, element)') do
    el1 = @driver.find_element(:css, 'div')
    expect(isEqualElements(@driver, el1, el1)).to eq(true)
  end
  it('isEqualElements(element1, element2)') do
    el1 = @driver.find_element(:css, 'div')
    el2 = @driver.find_element(:css, 'h1')
    expect(isEqualElements(@driver, el1, el2)).to eq(false)
  end
end
