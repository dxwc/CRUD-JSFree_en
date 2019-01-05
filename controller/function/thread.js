const parse = require('node-html-parser').parse;

module.exports = (comments) =>
{
    const html = parse(``);
    let prev_length = comments.length;
    while(comments.length)
    {
        for(let i = 0; i < comments.length; ++i)
        {
            if(comments[i].replying_to === null)
            {
                html.appendChild
                (
                    parse
                    (
`<ul id='${comments[i].id}' class='comment'>
<li>
    <p>${comments[i].content}</p>
    By: <a href='/user/${comments[i].commenter}'>${comments[i].commenter}</a>
    <a href='/reply_to/${comments[i].id}'>Reply</a>
    <a
        class='right'
        href='/post/${comments[i].post_id}#${comments[i].id}'>link</a>
<li>
</ul>`
                    )
                );

                comments.splice(i, 1);
                break;
            }
            else if(html.querySelector('#' + comments[i].replying_to))
            {
                html.querySelector('#' + comments[i].replying_to).appendChild
                (
                    parse
                    (
`<ul id='${comments[i].id}' class='comment'>
<li>
    <p>${comments[i].content}</p>
    By: <a href='/user/${comments[i].commenter}'>${comments[i].commenter}</a>
    <a href='/reply_to/${comments[i].id}'>Reply</a>
    <a
        class='right'
        href='/post/${comments[i].post_id}#${comments[i].id}'>link</a>
</li>
</ul>`
                    )
                )

                comments.splice(i, 1);
                break;
            }
        }

        if(prev_length === comments.length) break;
        else prev_length = comments.length;
    }

    return html.toString();
}