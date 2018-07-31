# Dev Doc

TODO

## Local dev

### Database server

+ If uses systemd, ensure postgresql service has been started
    + `sudo systemctl start postgresql`
    + To stop: `sudo systemctl stop postgresql`

+ Create username and password:
    + `sudo -u postgres psql`
    + `CREATE USER crud_admin WITH PASSWORD 'crud_pass' CREATEDB;`
    + `CREATE DATABASE crud OWNER crud_admin;`

+ Logging into to psql as the user on the db:
    + `sudo psql -U crud_admin -d crud`

+ Some psql commands:
    + `\conninfo`
    + `DROP OWNED BY current_user CASCADE;` -- cleans everything
    + `\dt`
    + `\d`
    + `\dt+`