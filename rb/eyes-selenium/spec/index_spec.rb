require('webdrivers/chromedriver')
require_relative('../lib/index')

describe('e2e') do
  describe('classic') do
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
end
