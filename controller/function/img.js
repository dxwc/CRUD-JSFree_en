const imgs =
{
    'fish.jpeg' : `<img src='/fish_smaller_t.png'>`
}

module.exports = (input) =>
{
    return input.replace
    (
        new RegExp(Object.keys(imgs).join('|'),'gi'),
        (found) => imgs[found]
    );
}