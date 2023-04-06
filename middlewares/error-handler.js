function handleErrors(err, req, res, next) {
    console.log(err);
    res.status(500).render('shared/500');
}

module.exports = handleErrors;