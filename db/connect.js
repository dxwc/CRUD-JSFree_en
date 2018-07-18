const pgp = require('pg-promise')(/*options*/);
if(typeof process.env.DATABASE_URL === 'string') pgp.pg.defaults.ssl = true;
const cn = process.env.DATABASE_URL ||
           'postgres://crud_admin:crud_pass@localhost:5432/crud';
const db = pgp(cn);

module.exports = db;