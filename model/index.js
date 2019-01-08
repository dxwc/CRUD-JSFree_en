const Sequelize = require('sequelize');
const SQstore   = require('connect-session-sequelize')
                  (require('express-session').Store);

const sequelize = process.env.DATABASE_URL ?
new Sequelize
(
    process.env.DATABASE_URL,
    {
        dialect : 'postgres',
        logging : false,
        operatorsAliases : false // removes a deprecation warning
    }
) :
new Sequelize
(
    'site',
    'site_admin',
    'site_pass',
    {
        host : 'localhost',
        dialect : 'postgres',
        logging : false,
        operatorsAliases : false // removes a deprecation warning
    }
);

const user = sequelize.define
(
    'user',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        uname :
        {
            type : Sequelize.TEXT,
            unique : true,
            allowNull : false
        },
        upass :
        {
            type : Sequelize.TEXT,
            allowNull : false
        }
    }
);

const post = sequelize.define
(
    'post',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        by :
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        content :
        {
            type : Sequelize.TEXT,
            allowNull : false
        }
    }
);

const comment = sequelize.define
(
    'comment',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        commenter :
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        post_id :
        {
            type : Sequelize.UUID,
            references :
            {
                model : post,
                key : 'id'
            }
        },
        replying_to :
        {
            type : Sequelize.UUID,
            allowNull : true
        },
        content :
        {
            type : Sequelize.TEXT,
            allowNull : false
        }
    }
);

const report = sequelize.define
(
    'report',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        by :
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        content :
        {
            type : Sequelize.TEXT,
            allowNull : false
        },
        response :
        {
            type : Sequelize.TEXT,
            allowNull : true
        }
    }
);

const follow = sequelize.define
(
    'follow',
    {
        user_id :
        {
            type : Sequelize.UUID,
            primaryKey: true,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        following :
        {
            type : Sequelize.UUID,
            primaryKey: true,
            references :
            {
                model : user,
                key : 'id'
            }
        },
    }
);

const myStore = new SQstore({ db : sequelize });

function connect()
{
    return new Promise((resolve, reject) =>
    {
        sequelize.sync
        ({
            logging : false,
            // // force: true, // !!! DELETES ALL DATA !!!
            // alter : true // deleted data where necessary
        })
        .then(() =>
        {
            myStore.sync();
            console.info('- DB server connection started');
            return resolve(sequelize);
        })
        .catch((err) =>
        {
            console.error('Error setting up tables');
            console.error(err);
            process.exit(1);
        });
    });
}

module.exports.sequelize = sequelize;
module.exports.connect   = connect;
module.exports.user      = user;
module.exports.post      = post;
module.exports.comment   = comment;
module.exports.report    = report;
module.exports.follow    = follow;
module.exports.store     = myStore;