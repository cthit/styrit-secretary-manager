INSERT INTO fkit_super_group (id, name, pretty_name, email, type)
VALUES (
        '4b0a7b4c-e256-46b3-baf4-a29ae35e01dc',
        'styrit',
        'StyrIT',
        'a@test.com',
        'COMMITTEE'
    );

INSERT INTO internal_text(id, sv, en)
VALUES (
        '56777d1c-c675-456d-b092-046f4c97b6dc',
        ' ',
        ' '
    );

INSERT INTO fkit_group (
        id,
        name,
        pretty_name,
        description,
        function,
        becomes_active,
        becomes_inactive,
        fkit_super_group,
        email,
        avatar_url
    )
VALUES (
        '03c9c16f-74ed-4a6f-a9f8-175d6f9d1efd',
        'styrit1927',
        'StyrIT 1927',
        '56777d1c-c675-456d-b092-046f4c97b6dc',
        '56777d1c-c675-456d-b092-046f4c97b6dc',
        '2022-11-14',
        '2099-01-01',
        '4b0a7b4c-e256-46b3-baf4-a29ae35e01dc',
        'peep@test.com',
        NULL
    );

INSERT INTO post(id, post_name, email_prefix)
VALUES (
        '93f87ace-a3b4-4e21-92a0-9735e1c4c264',
        '56777d1c-c675-456d-b092-046f4c97b6dc',
        NULL
    );

INSERT INTO membership(
        ituser_id,
        fkit_group_id,
        post_id,
        unofficial_post_name
    )
SELECT id,
    '03c9c16f-74ed-4a6f-a9f8-175d6f9d1efd',
    '93f87ace-a3b4-4e21-92a0-9735e1c4c264',
    ' pepe '
FROM ituser
WHERE cid = 'admin';

INSERT INTO itclient(
    id,
    client_id,
    client_secret,
    web_server_redirect_uri,
    access_token_validity,
    refresh_token_validity,
    auto_approve,
    name,
    description
) VALUES (
    '4f96764d-63a4-4610-9cd8-1389f60461b8',
    'id',
    '{noop}secret',
    'http://localhost:3001/auth/account/callback',
    3600, 
    500000000,
    true,
    'secretary-manager',
    '56777d1c-c675-456d-b092-046f4c97b6dc'
);