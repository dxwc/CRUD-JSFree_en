May need to run `systemctl start postgresql` or similar command to start postgresql service

Run once:

+ `sudo -u postgres createuser -P -s -e site_admin` and set account password: `site_pass`
+ `sudo -u postgres createdb site --owner site_admin`
+ `sudo psql -U site_admin -d site -W < ./node_modules/connect-pg-simple/table.sql`
    + TODO: add session store

One way to browse and manipulate data :

+ `sudo psql -U site_admin -d site -W` and then enter password `site_pass`
+ Accepts all valid postgres SQL commands, example :
    + Count number of entry in users table: `SELECT COUNT(*) FROM users;`
    + Get max of 5 username from db: `SELECT uname FROM users LIMIT 5;`
    + Deletes/removes everything: `DROP OWNED BY current_user CASCADE;`
+ Additional commands example:
    + `\d <table name>` shows description of table
    + `\dt` or `\dt+` to list relations
    + `\l` lists all database
    + `\conninfo` shows connection info
    + `\?` prints available `psql` command and help text
    + `\q` to quit