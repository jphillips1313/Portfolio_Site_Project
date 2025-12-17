INSERT INTO
    users (
        username,
        email,
        password_hash,
        is_admin
    )
VALUES (
        'Jack',
        'jackphillips1313@gmail.com',
        '$2a$12$tj4vncJfTl9OQk8dFYi/XOfTki3dwAlADL7s1K9Vkszy0cICKP7FW',
        true
    ) ON CONFLICT (username) DO NOTHING;
