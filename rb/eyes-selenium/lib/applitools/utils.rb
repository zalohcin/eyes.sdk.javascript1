#require 'net/http'
require 'open-uri'
require 'fileutils'

module Applitools
  module Utils
    extend self

    def download_universal_server
      # local
      filename = get_filename
      folder_name = create_server_directory
      filepath = File.expand_path(filename, folder_name)
      # remote
      base_url = 'https://github.com/applitools/eyes.sdk.javascript1/releases/download/test_eyes-universal%400.0.1'
      uri = URI.parse(base_url + "/#{filename}")
      puts "[eyes-selenium] Downloading Eyes universal server from #{uri}"
      File.write(filepath, URI.open(uri).read)
      make_file_executable(filepath)
      puts "[eyes-selenium] Download complete. Server placed in #{filepath}"
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

      def create_server_directory
        folder_name = '.bin'
        Dir.mkdir(folder_name) if (!File.directory?(folder_name))
        folder_name
      end

      def make_file_executable(path_to_file)
        FileUtils.chmod('+x', path_to_file)
      end
  end
end

