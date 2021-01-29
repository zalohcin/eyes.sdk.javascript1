require('webdrivers/chromedriver')
require_relative('../lib/index')

describe('e2e') do
  before(:all) do
    options = ::Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    @driver = ::Selenium::WebDriver.for :chrome, options: options
    url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
    @driver.get url
  end
  after(:all) do
    @driver.quit
  end
  it('eyes.open works') do
    eyes = ::Applitools::Selenium::Eyes.new
    eyes.open(@driver, {appName: 'eyes-selenium.rb', testName: 'hello world', vg: false})
    expect(eyes.open?).to eq(true)
  end
end
