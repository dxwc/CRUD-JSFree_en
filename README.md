A simple content sharing site with user posts and threaded comments

# Features

+ No frontend JavaScript, No third party
+ Submit post
    + Markdown formatted styling (excluding html, link nd image embeds)
    + Edit post
    + Delete post
    + Report post
+ Threaded comment
    + Reply/delete comment
    + Child comments preserved when parent is deleted
+ Pre approved media embed or shortcuts on post or threaded comment view
+ Front page
    + 60 seconds caching
    + Sorts by most user activity + mix of a few of the newly submitted post
+ New post view
    + Paged(100 per page) and ordered by time view
+ User Follow/Unfollow
    + Only visible to themselves: saves username on their profile
+ User activity summery
    + Table of post and comment activity on profile
+ XSS protection, input validation, password hashing, authentication captcha, post
  submission time limit and security headers are set

# Install

+ Install and setup PostgreSQL database ([example](./doc/README.md))
+ Install Node.js version 10.14.2 or higher (under 11)
+ Git clone this repository and go to cloned directory
+ Run `npm install`
+ Set these environmental variables :
    + `PORT` to the port this should run on. Default: `9001`
    + `DATABASE_URL` to the database connection URL. Default:
        + Username: `site_admin`
        + Password: `site_pass`
        + Database: `site`
    + `user_name` to admin username. Default on `npm start` : `admin`
    + `password` to admin password. Default on `npm start` : `123`
    + `SESSION_SECRET` to a string that will be used to sign session cookie ID
+ Session cookie settings be found on `./index.js`
+ Static files goes here: `./view/public/`
+ Pages and templates are here : `./view/public/templates`
+ To modify CSS, edit `./view/public/main.css`
+ To add/modify embed shortcuts, edit `./controller/function/img.js`
+ To modify captcha settings ([doc](https://github.com/lemonce/svg-captcha#readme)) edit: `./controller/function/captcha.js`
+ Start: `node index.js`