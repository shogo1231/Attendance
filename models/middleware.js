// class notLoggedOnError extends UnauthorizedError{};
// class UnauthorizedError extends Error{};

/**
 * セッションにユーザ情報が格納されているか確認(ログイン認証)
 */
module.exports.auth = function (options) {
  return function (req, res, next) {
    let user =  req.session.user
    let test =  options;

    if(!user) {
      res.status(403).render('common/logonErr');
    }
    else {
      next();
    }
  }
}