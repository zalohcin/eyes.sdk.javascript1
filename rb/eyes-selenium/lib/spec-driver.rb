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
end
