-- Insert an admin user with a hashed password
INSERT INTO users (username, display_name, email, password, bio, created_at, role)
VALUES 
('admin_user', 'Admin User', 'admin@example.com', '$2b$10$wqHW3QGS1wTWb/QylizNCOCXJXOgHjZZg6s8/u8btJYf6izNJ1hBG', 'Administrator of the system', GETDATE(), 'admin');

-- Insert dummy films
INSERT INTO films (title, synopsis, status, total_episodes, release_date)
VALUES 
('Oppenheimer', 'The story of J. Robert Oppenheimer and the creation of the atomic bomb.', 'finished_airing', 1, '2023-07-21'),
('Inception', 'A thief who steals corporate secrets through dream-sharing technology.', 'finished_airing', 1, '2010-07-16'),
('The Matrix', 'A computer hacker learns about the true nature of reality.', 'finished_airing', 1, '1999-03-31'),
('Avatar 2', 'A sequel to the epic science fiction film Avatar.', 'airing', 1, '2024-12-18'),
('Upcoming Sci-Fi', 'A futuristic sci-fi movie yet to be released.', 'not_yet_aired', 1, '2025-08-01');

-- Insert dummy genres
INSERT INTO genres (name)
VALUES 
('Drama'),
('History'),
('Sci-Fi'),
('Action'),
('Adventure');

-- Insert dummy films_genres (many-to-many relationships)
INSERT INTO films_genres (films_id, genres_id)
VALUES 
(1, 1), -- Oppenheimer -> Drama
(1, 2), -- Oppenheimer -> History
(2, 3), -- Inception -> Sci-Fi
(2, 4), -- Inception -> Action
(3, 3), -- The Matrix -> Sci-Fi
(3, 4), -- The Matrix -> Action
(4, 3), -- Avatar 2 -> Sci-Fi
(4, 5), -- Avatar 2 -> Adventure
(5, 3); -- Upcoming Sci-Fi -> Sci-Fi

-- Insert dummy images
INSERT INTO images (img, films_id)
VALUES 
(CAST('0xFFD8FFE000104A46494600010101006000600000FFD9' AS VARBINARY(MAX)), 1), -- Oppenheimer
(CAST('0xFFD8FFE000104A46494600010101006000600000FFD9' AS VARBINARY(MAX)), 2), -- Inception
(CAST('0xFFD8FFE000104A46494600010101006000600000FFD9' AS VARBINARY(MAX)), 3), -- The Matrix
(CAST('0xFFD8FFE000104A46494600010101006000600000FFD9' AS VARBINARY(MAX)), 4), -- Avatar 2
(CAST('0xFFD8FFE000104A46494600010101006000600000FFD9' AS VARBINARY(MAX)), 5); -- Upcoming Sci-Fi

-- Insert dummy user_film_list
INSERT INTO user_film_list (list_type, updated_at, users_id, films_id)
VALUES 
('completed', GETDATE(), 2, 1), -- John -> Oppenheimer
('completed', GETDATE(), 2, 2), -- John -> Inception
('watching', GETDATE(), 3, 4), -- John -> Avatar 2
('plan_to_watch', GETDATE(), 3, 3), -- Jane -> The Matrix
('plan_to_watch', GETDATE(), 3, 5); -- Jane -> Upcoming Sci-Fi

-- Insert dummy reviews
INSERT INTO reviews (rating, comment, created_at, updated_at, users_id, films_id)
VALUES 
(9, 'Amazing movie about history and science.', GETDATE(), GETDATE(), 2, 1), -- John -> Oppenheimer
(8, 'Mind-bending and thrilling.', GETDATE(), GETDATE(), 2, 2), -- John -> Inception
(10, 'A sci-fi masterpiece!', GETDATE(), GETDATE(), 3, 3); -- Jane -> The Matrix

-- Insert dummy review_reactions
INSERT INTO review_reactions (reaction, updated_at, users_id, reviews_id)
VALUES 
('like', GETDATE(), 3, 1), -- Jane likes John's review of Oppenheimer
('like', GETDATE(), 2, 3); -- John likes Jane's review of The Matrix