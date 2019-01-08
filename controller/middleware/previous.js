module.exports = (req, res, next) =>
{
    if
    (
        req.originalUrl.indexOf('/sign_in') === -1 &&
        req.originalUrl.indexOf('/sign_up') === -1 &&
        req.originalUrl.indexOf('/sign_out') === -1
    )
    {
        req.session.previous = req.originalUrl;
    }

    next();
}