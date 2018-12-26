const Sequelize = require('sequelize');

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

const post_comment = sequelize.define
(
    'post_comment',
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
        on :
        {
            type : Sequelize.UUID,
            references :
            {
                model : post,
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

const comment_comment = sequelize.define
(
    'comment_comment',
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
        on :
        {
            type : Sequelize.UUID,
            references :
            {
                model : post_comment,
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
)

function connect()
{
    return new Promise((resolve, reject) =>
    {
        sequelize.sync
        ({
            logging : false,
            // force: true, // deletes all data
            // alter : true // deleted data where necessary
        })
        .then(() =>
        {
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
module.exports.connect = connect;
module.exports.user = user;
module.exports.post = post;
module.exports.post_comment = post_comment;
module.exports.comment_comment = comment_comment;
module.exports.report = report;