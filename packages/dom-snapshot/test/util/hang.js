module.exports = (req, _res, next) => {
  console.log('xxx', req.url, req.method);
  if (req.url !== '/hanging.css') {
    next();
  }
};
