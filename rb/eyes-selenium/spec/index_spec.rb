require('webdrivers/chromedriver')
require_relative('../lib/index')
require_relative('./spec_helper')

describe('e2e') do
  before(:each) do
    options = ::Selenium::WebDriver::Chrome::Options.new
    options.add_argument('--headless')
    @driver = ::Selenium::WebDriver.for :chrome, options: options
    url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
    @driver.get url
  end
  after(:each) do
    @driver.quit
  end
  describe('classic') do
    skip
    it('check window viewport') do
      eyes = ::Applitools::Selenium::Eyes.new
      eyes.open(@driver, {appName: 'eyes-selenium.rb', testName: 'classic, check window viewport', vg: false})
      eyes.check({})
      eyes.close()
    end
    it('check window fully') do
      eyes = ::Applitools::Selenium::Eyes.new
      eyes.open(@driver, {appName: 'eyes-selenium.rb', testName: 'classic, check window fully', vg: false})
      eyes.check({isFully: true})
      eyes.close()
    end
  end
  describe('vg') do
    it('check window viewport', :only) do
      eyes = ::Applitools::Selenium::Eyes.new
      eyes.open(@driver, {appName: 'eyes-selenium.rb', testName: 'vg, check window viewport', vg: true})
      eyes.check({})
      eyes.close()
    end
    it('check window fully') do
      eyes = ::Applitools::Selenium::Eyes.new
      eyes.open(@driver, {appName: 'eyes-selenium.rb', testName: 'vg, check window fully', vg: true})
      eyes.check({isFully: true})
      eyes.close()
    end
  end
end
