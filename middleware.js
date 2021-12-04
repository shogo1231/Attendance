class UnauthorizedError extends Error{};
class notLoggedOnError extends UnauthorizedError{};


/**
 * ログイン認証
 */
module.exports = function (options) {
  return function (req, res, next) {
    let user =  req.session.user
    let auth =  options;

    if(!user) {
      res.status(403).render('common/logonErr');
    }
    else {
      next();
    }
  }
}