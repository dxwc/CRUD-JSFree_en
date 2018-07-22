-- TODO: Needs clarification on how to handle

CREATE TABLE people
(
    id     UUID PRIMARY KEY, -- uuid v4
    u_name TEXT NOT NULL UNIQUE,
    u_pass TEXT NOT NULL,
    joined INT NOT NULL, -- unix time
    marker SMALLINT -- any special marker might there any need arises later
);

CREATE TABLE submission
(
    id        UUID PRIMARY KEY, -- uuid v4
    posted_by UUID REFERENCES people(id),
    title     TEXT NOT NULL,
    content   TEXT NOT NULL,
    published INT NOT NULL, -- unix time
    marker    SMALLINT -- markers such as reported, link post, text only post etc
);

CREATE TABLE comment
(
    id          UUID PRIMARY KEY,
    parent_type BOOLEAN NOT NULL, -- true: post, false: comment
    parent      UUID REFERENCES submission(id),
    posted_by   UUID REFERENCES people(id),
    content     TEXT NOT NULL,
    published   INT NOT NULL -- unix time
);

CREATE TABLE report
(
    id            UUID PRIMARY KEY,
    reported_id   UUID NOT NULL, -- post or comment id
    reported_type BOOLEAN NOT NULL, -- post or comment being reported
    posted_by     UUID REFERENCES people(id),
    published     INT NOT NULL, -- for user
    content       TEXT NOT NULL, -- for user
    marker        SMALLINT, -- for user
    reaction      SMALLINT, -- for admin
    note          TEXT -- for admin
);