const parse = require('node-html-parser').parse;

function a_comment(id, content, commenter, post_id, created_at, name)
{
    return `<ul id='${id}' class='comment'>
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
}

module.exports = (comments, name) =>
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
                        a_comment
                        (
                            comments[i].id,
                            comments[i].content,
                            comments[i].commenter,
                            comments[i].post_id,
                            comments[i].createdAt,
                            name
                        )
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
                        a_comment
                        (
                            comments[i].id,
                            comments[i].content,
                            comments[i].commenter,
                            comments[i].post_id,
                            comments[i].createdAt,
                            name
                        )
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