module SpecDriver
  extend self

  def isEqualElements(driver, element1, element2)
    element1.hash == element2.hash
  end

  def executeScript(driver, script, *args)
    driver.execute_script(script, *args)
  end

  def mainContext(driver)
    driver.switch_to.default_content
  end

  def parentContext(driver)
    driver.switch_to.parent_frame
  end

  def childContext(driver, element)
    driver.switch_to.frame(element)
  end

  def findElement(driver, selector)
    driver.find_element(transformSelector(selector))
  end

  def findElements(driver, selector)
    driver.find_elements(transformSelector(selector))
  end

  def getWindowRect(driver)
    driver.manage.window.rect
  end

  def setWindowRect(driver, rect)
    if rect[:width] && rect[:height]
      driver.manage.window.resize_to(rect[:width], rect[:height])
    end
    if rect[:x] && rect[:y]
      driver.manage.window.move_to(rect[:x], rect[:y])
    end
  end

  def getTitle(driver)
    driver.title
  end

  def getUrl(driver)
    driver.current_url
  end

  def getDriverInfo(driver)
    caps = driver.capabilities
    {
      :platformName => caps.platform,
      :isMobile => caps.platform.include?(('android' or 'ios'))
    }
  end

  private

    def transformSelector(selector)
      return {css: selector}
    end

end
