module.exports = (input) =>
{
    return input.replace(/\s|:|\/|#|\?|&|@|%|\+/g, '_')
}