class EyesTestController {
  async setup(options) {
    throw new TypeError('EyesTestController::setup is not implemented')
  }
  async cleanup() {
    throw new TypeError('EyesTestController::cleanup is not implemented')
  }
  async open({appName, viewportSize}) {
    throw new TypeError('EyesTestController::open is not implemented')
  }
  async checkWindow(options) {
    throw new TypeError('EyesTestController::checkWindow is not implemented')
  }
  async checkRegion(target, options) {
    throw new TypeError('EyesTestController::checkRegion is not implemented')
  }
  async checkFrame(target, options) {
    throw new TypeError('EyesTestController::checkFrame is not implemented')
  }
  async close(throwEx) {
    throw new TypeError('EyesTestController::close is not implemented')
  }
  async abort() {
    throw new TypeError('EyesTestController::abort is not implemented')
  }
  async getAllTestResults() {
    throw new TypeError('EyesTestController::getAllTestResults is not implemented')
  }
  async visit(url) {
    throw new TypeError('EyesTestController::visit is not implemented')
  }
  async type(selector, text) {
    throw new TypeError('EyesTestController::type is not implemented')
  }
  async switchToFrame(selector) {
    throw new TypeError('EyesTestController::switchToFrame is not implemented')
  }
  async scrollDown(pixels) {
    throw new TypeError('EyesTestController::scrollDown is not implemented')
  }
}

module.exports = EyesTestController
