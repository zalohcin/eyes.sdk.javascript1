
module.exports = () => {

  async function getImageSizes(_ref) {
    var bgImages, _ref$timeout, timeout, _ref$Image, Image;

    return await regeneratorRuntime.async(function getImageSizes$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bgImages = _ref.bgImages, _ref$timeout = _ref.timeout, timeout = _ref$timeout === void 0 ? 5000 : _ref$timeout, _ref$Image = _ref.Image, Image = _ref$Image === void 0 ? window.Image : _ref$Image;
            _context.next = 3;
            return regeneratorRuntime.awrap(Promise.all(window.Array.from(bgImages).map(function (url) {
              return Promise.race([new Promise(function (resolve) {
                var img = new Image();

                img.onload = function () {
                  return resolve({
                    url: url,
                    width: img.naturalWidth,
                    height: img.naturalHeight
                  });
                };

                img.onerror = function () {
                  return resolve();
                };

                img.src = url;
              }), psetTimeout(timeout)]);
            })));

          case 3:
            _context.t0 = function (images, curr) {
              if (curr) {
                images[curr.url] = {
                  width: curr.width,
                  height: curr.height
                };
              }

              return images;
            };

            _context.t1 = {};
            return _context.abrupt("return", _context.sent.reduce(_context.t0, _context.t1));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  return captureFrameAndPoll()
}