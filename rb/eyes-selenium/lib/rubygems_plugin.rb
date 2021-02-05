require 'net/http'

module Applitools
  module Utils
    extend self

    def download_universal_server
      base_url = 'https://github.com/applitools/eyes.sdk.javascript1/releases/tag/test_eyes-universal%400.0.1'
      filename = get_filename
      puts "Downloading Eyes universal server from #{base_url}..."
      File.write(filename, Net::HTTP.get(URI.parse(base_url + "/#{filename}")))
      puts 'Done!'
    end

    private

      def get_filename
        case RUBY_PLATFORM
        when /mswin|windows/i
          'app-win.exe'
        when /linux|arch/i
          'app-linux'
        when /darwin/i
          'app-macos'
        else
          raise 'Unsupported platform'
        end
      end
  end
end

Gem.post_install do
  ::Applitools::Utils.download_universal_server
end
