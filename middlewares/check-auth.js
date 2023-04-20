function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    if (!uid) {
        return next();
    }
    
    res.locals.uid = uid;
    res.locals.isAuth = true;
    res.locals.isAdmin = req.session.isAdmin;
    next();
};

// 세션을 만드는 페이지는 login.routes.js에 있다
// 페이지 안에 만들어진 세션이 있는지 확인한다. 만약 세션이 없다면, 유저는 로그인하지 않은 상태이다.
// 세션을 찾았다면 res.locals에 uid와 isAuth를 추가한다.

module.exports = checkAuthStatus;