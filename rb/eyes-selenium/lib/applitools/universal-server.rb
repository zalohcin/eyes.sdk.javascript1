require('open-uri')
require('socket')
require('digest')

module Applitools
  module UniversalServer
    FOLDER_PATH = '.bin'
    EXPECTED_BINARY_SHA = '9cc2ec97397050a71e628e2e8972eb408e025bb77b088e12316ce15c9d488ecc'
    extend self

    def download
      filename = get_filename
      filepath = get_filepath
      return if File.exist?(filepath) && Digest::SHA256.file(filepath).to_s == EXPECTED_BINARY_SHA
      base_url = 'https://github.com/applitools/eyes.sdk.javascript1/releases/download/test_eyes-universal%400.0.1'
      uri = URI.parse(base_url + "/#{filename}")
      create_server_directory
      puts "[eyes-selenium] Downloading Eyes universal server from #{uri}"
      File.write(filepath, URI.open(uri).read)
      puts "[eyes-selenium] Download complete. Server placed in #{filepath}"
    end

    def run
      pid = spawn(get_filepath, [:out, :err] => [File::NULL, 'w'])
      Process.detach(pid)
    end

    def confirm_is_up(ip, port, attempt = 1)
      raise 'Universal server unavailable' if (attempt === 16)
      begin
        TCPSocket.new(ip, port)
      rescue Errno::ECONNREFUSED
        sleep 1
        confirm_is_up(ip, port, attempt + 1)
      end
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

      def get_filepath
        File.expand_path(get_filename, FOLDER_PATH)
      end

      def create_server_directory
        Dir.mkdir(FOLDER_PATH) if (!File.directory?(FOLDER_PATH))
      end
  end
end

