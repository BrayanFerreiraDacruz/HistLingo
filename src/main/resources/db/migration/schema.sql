CREATE TABLE IF NOT EXISTS modules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_id BIGINT REFERENCES modules(id),
    xp_reward INT NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS challenges (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lesson_id BIGINT REFERENCES lessons(id),
    content TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    difficulty_weight DOUBLE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp_total INT DEFAULT 0,
    level INT DEFAULT 1,
    current_count INT DEFAULT 0,
    last_activity_date TIMESTAMP,
    recovery_freeze_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT REFERENCES users(id),
    challenge_id BIGINT REFERENCES challenges(id),
    ease_factor FLOAT NOT NULL,
    interval INT NOT NULL,
    repetitions INT NOT NULL,
    next_review_date TIMESTAMP NOT NULL
);
