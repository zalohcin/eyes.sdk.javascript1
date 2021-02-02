module Applitools
  module Logger
    extend self

    def log(message)
      if (ENV['APPLITOOLS_SHOW_LOGS'])
        puts message
      end
    end
  end
end
