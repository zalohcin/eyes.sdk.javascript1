require('selenium-webdriver')
require('webdrivers/chromedriver')
require_relative('../lib/index')

#eyes = ::Applitools::Selenium::Eyes.new({skipPrepareSocket: true})
#puts eyes.inspect
#puts eyes.public_methods.sort

describe('e2e') do
  it('works') do
    begin
      options = ::Selenium::WebDriver::Chrome::Options.new
      options.add_argument('--headless')
      driver = ::Selenium::WebDriver.for :chrome, options: options
      url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
      driver.get url
      eyes = ::Applitools::Selenium::Eyes.new()
      eyes.open(driver, 'eyes-selenium.rb', 'hello world')
      eyes.check({})
      eyes.close()
    ensure
      driver.quit
    end
  end
end
