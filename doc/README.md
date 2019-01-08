May need to run `systemctl start postgresql` or similar command to start postgresql service

Run once:

+ `sudo -u postgres createuser -P -s -e site_admin` and set account password: `site_pass`
+ `sudo -u postgres createdb site --owner site_admin`

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

# Sequelize sync create log dump :
```
CREATE TABLE IF NOT EXISTS "users" ("id" UUID , "uname" TEXT NOT NULL UNIQUE, "upass" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "posts" ("id" UUID , "by" UUID REFERENCES "users" ("id"), "content" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMPWITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "comments" ("id" UUID , "commenter" UUID REFERENCES"users" ("id"), "post_id" UUID REFERENCES "posts" ("id"), "replying_to" UUID, "content" TEXT NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "reports" ("id" UUID , "by" UUID REFERENCES "users"("id"), "content" TEXT NOT NULL, "response" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "follows" ("user_id" UUID  REFERENCES "users" ("id"), "following" UUID  REFERENCES "users" ("id"), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("user_id","following"));

CREATE TABLE IF NOT EXISTS "Sessions" ("sid" VARCHAR(36) , "expires" TIMESTAMPWITH TIME ZONE, "data" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("sid"));```