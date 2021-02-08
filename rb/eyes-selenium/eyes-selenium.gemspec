require_relative('lib/applitools/version')
require_relative('lib/applitools/universal-server')

def download_server_once
  singleton_class.send(:undef_method, __method__)
  ::Applitools::UniversalServer.download
end

Gem.post_install do |gem|
  begin
    download_server_once
  rescue
    # no-op
  end
end

Gem::Specification.new do |spec|
  spec.name          = 'eyes-selenium'
  spec.version       = Applitools::Selenium::VERSION
  spec.authors       = ['Applitools Team']
  spec.email         = ['team@applitools.com']
  spec.description   = 'Provides SDK for writing Applitools Selenium-based tests'
  spec.summary       = 'Applitools Ruby Selenium SDK'
  spec.homepage      = 'https://www.applitools.com'
  spec.license       = 'Applitools'

  spec.files         = Dir.glob('lib/**/*.rb')
  spec.require_paths = %w[lib]
  spec.add_dependency 'faye-websocket'
  spec.add_dependency 'eventmachine'
  spec.add_dependency 'colorize'
  spec.add_development_dependency 'rspec'
  spec.add_development_dependency 'guard-rspec'
  spec.add_development_dependency 'webdrivers' # pulls in selenium-webdriver & browser driver(s)
  spec.add_development_dependency 'pry-byebug'
end
