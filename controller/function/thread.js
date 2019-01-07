const cheerio = require('cheerio');

function a_comment(id, content, commenter, post_id, created_at, name)
{
    return content ? `<ul id='${id}' class='comment'>
<li>
    <p>${content}</p>
    <span class='meta_info'>
    <a href='/user/${commenter}'>${commenter}</a> ${created_at}
    <a
        class='comment_action'
        href='/post/${post_id}#${id}'>link</a>
    ${name === commenter ?
        `<a class='comment_action' href='/delete_comment/${id}'>delete</a>` : ``}
    ${name ? `<a class='comment_action' href='/reply_to/${id}'>reply</a>` : ``}
    </span>
<li>
</ul>`
:
`<ul id='${id}' class='comment'>
<li>
    <i class='meta_info'>
        [ Comment deleted. It is possible this was a reply to another comment. ]
    </i>
<li>
</ul>`
}

module.exports = (comments, name) =>
{
    let html = cheerio.load(`<span class='comments'></span>`, { xmlMode: true });

    for(let i = 0; i < comments.length; ++i)
    {
        if(comments[i].replying_to === null)
        {
            html('.comments').append
            (
                a_comment
                (
                    comments[i].id,
                    comments[i].content,
                    comments[i].commenter,
                    comments[i].post_id,
                    comments[i].createdAt,
                    name
                )
            );
        }
        else if(html('#' + comments[i].replying_to).html())
        {
            html('#' + comments[i].replying_to).append
            (
                a_comment
                (
                    comments[i].id,
                    comments[i].content,
                    comments[i].commenter,
                    comments[i].post_id,
                    comments[i].createdAt,
                    name
                )
            );
        }
        else
        {
            html('.comments').append
            (
                a_comment
                (
                    comments[i].replying_to,
                    null,
                    null,
                    comments[i].post_id,
                    null
                )
            );

            html(`#${comments[i].replying_to}`).append
            (
                a_comment
                (
                    comments[i].id,
                    comments[i].content,
                    comments[i].commenter,
                    comments[i].post_id,
                    comments[i].createdAt,
                    name
                )
            );
        }
    }

    return html.html();
}