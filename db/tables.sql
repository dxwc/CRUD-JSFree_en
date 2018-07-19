-- TODO: Needs clarification on how to handle

CREATE TABLE people
(
    id     TEXT PRIMARY KEY, -- uuid v4
    u_name TEXT NOT NULL UNIQUE,
    u_pass TEXT NOT NULL,
    joined INT NOT NULL, -- unix time
    marker SMALLINT -- any special marker might there any need arises later
);

CREATE TABLE submission
(
    id        TEXT PRIMARY KEY, -- uuid v4
    posted_by TEXT REFERENCES people(id),
    title     TEXT NOT NULL,
    content   TEXT,
    published INT NOT NULL, -- unix time
    marker    SMALLINT -- markers such as reported, link post, text only post etc
);

CREATE TABLE comment
(
    id          TEXT PRIMARY KEY,
    parent_type BOOLEAN NOT NULL, -- true: post, false: comment
    parent      TEXT NOT NULL,
    posted_by   TEXT REFERENCES people(id),
    content     TEXT NOT NULL,
    published   INT NOT NULL -- unix time
);

CREATE TABLE report
(
    id            TEXT PRIMARY KEY,
    reported_id   TEXT NOT NULL, -- post or comment id
    reported_type BOOLEAN NOT NULL, -- post or comment being reported
    posted_by     TEXT REFERENCES people(id),
    published     INT NOT NULL, -- for user
    content       TEXT NOT NULL, -- for user
    marker        SMALLINT, -- for user
    reaction      SMALLINT, -- for admin
    note          TEXT -- for admin
);