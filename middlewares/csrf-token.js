function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

// csrfToken을 res.locals에 저장한다.
// 써먹으려면 ejs파일에 사용해야한다.

module.exports = addCsrfToken;