-- Real Indian Sports Venues Data
-- Comprehensive seed data for production

-- Clear existing data
DELETE FROM booking;
DELETE FROM ground;
DELETE FROM users;

-- Insert users
INSERT INTO users (id, email, password, name, roles) VALUES
(1, 'user@letsplay.com', 'password', 'Demo User', ARRAY['USER']),
(2, 'owner@letsplay.com', 'password', 'Venue Owner', ARRAY['GROUND_OWNER']),
(3, 'admin@letsplay.com', 'password', 'Admin', ARRAY['ADMIN']);

-- Insert real Indian sports grounds
INSERT INTO ground (id, name, location, sport_type, description, price_per_hour, image_url, owner_id) VALUES

-- BANGALORE - Cricket
(1, 'M. Chinnaswamy Stadium Practice Nets', 'Cubbon Road, Bangalore', 'Cricket', 
 'Professional cricket practice nets at the iconic Chinnaswamy Stadium. Features 6 turf wickets, bowling machines, and video analysis. Used by Karnataka Ranji team.', 
 2500, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 1),

(2, 'Bangalore Cricket Academy', 'Indiranagar, Bangalore', 'Cricket',
 'Premium indoor cricket facility with 4 synthetic wickets, professional coaching available. Air-conditioned nets with LED floodlights for night practice.',
 1800, 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800', 1),

-- BANGALORE - Football  
(3, 'Kanteerava Stadium Turf', 'Kasturba Road, Bangalore', 'Football',
 'FIFA-standard artificial turf at Bangalore''s premier stadium. Full-size pitch available for booking. Floodlights, changing rooms, and spectator seating included.',
 3500, 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', 1),

(4, 'Play Arena - Sarjapur', 'Sarjapur Road, Bangalore', 'Football',
 'Premium 5-a-side and 7-a-side football turfs. High-quality artificial grass, excellent drainage, and professional lighting. Parking available.',
 1200, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 1),

(5, 'Turf Park - Koramangala', 'Koramangala 4th Block, Bangalore', 'Football',
 'Popular neighborhood turf with both 5v5 and 7v7 options. Well-maintained artificial grass, good lighting, and convenient location.',
 800, 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800', 2),

-- BANGALORE - Badminton
(6, 'Prakash Padukone Badminton Academy', 'Padukone-Dravid Centre of Sports Excellence, Bangalore', 'Badminton',
 'World-class badminton facility founded by Prakash Padukone. 8 wooden courts with professional lighting. Coaching by certified trainers available.',
 600, 'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?w=800', 1),

(7, 'Smash Bounce - HSR Layout', 'HSR Layout Sector 2, Bangalore', 'Badminton',
 'Modern badminton center with 6 synthetic courts. AC facility, equipment rental, and shower rooms. Popular for corporate bookings.',
 500, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 2),

-- MUMBAI - Cricket
(8, 'Wankhede Stadium Nets', 'Churchgate, Mumbai', 'Cricket',
 'Practice at the legendary Wankhede Stadium! 4 turf practice wickets with professional equipment. Home ground of Mumbai Indians.',
 3000, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', 1),

(9, 'Shivaji Park Cricket Ground', 'Dadar, Mumbai', 'Cricket',
 'Historic ground where Sachin Tendulkar trained. Well-maintained turf wicket, traditional cricket atmosphere. Evening slots very popular.',
 1500, 'https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=800', 1),

-- MUMBAI - Football
(10, 'Cooperage Football Ground', 'Colaba, Mumbai', 'Football',
 'Mumbai''s oldest football ground with natural grass. Full-size pitch used by local leagues. Great for tournament bookings.',
 2800, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 2),

-- DELHI - Badminton
(11, 'Siri Fort Sports Complex', 'August Kranti Marg, New Delhi', 'Badminton',
 'Premier badminton facility in Delhi with 10 wooden courts. Hosted national championships. Professional-grade lighting and ventilation.',
 700, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', 1),

-- DELHI - Tennis
(12, 'DLTA Tennis Complex', 'Africa Avenue, New Delhi', 'Tennis',
 'Delhi Lawn Tennis Association complex with 18 courts (grass, clay, hard). Professional coaching available. Hosted Davis Cup matches.',
 1200, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800', 1),

-- KOLKATA - Cricket
(13, 'Eden Gardens Practice Facility', 'Maidan, Kolkata', 'Cricket',
 'Practice nets at the iconic Eden Gardens. 5 turf wickets with modern facilities. Experience the atmosphere of India''s largest cricket stadium.',
 2200, 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', 1),

-- KOLKATA - Football
(14, 'Salt Lake Stadium Turf', 'Bidhannagar, Kolkata', 'Football',
 'Artificial turf at Asia''s largest stadium. Full-size pitch with professional markings. Home of Mohun Bagan and East Bengal.',
 3200, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', 1),

-- CHENNAI - Basketball
(15, 'Nehru Stadium Basketball Court', 'Park Town, Chennai', 'Basketball',
 'Indoor basketball court with wooden flooring. AC facility, professional hoops, and seating for 200. Popular for inter-college tournaments.',
 900, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 2),

-- HYDERABAD - Cricket
(16, 'Rajiv Gandhi International Cricket Stadium Nets', 'Uppal, Hyderabad', 'Cricket',
 'World-class practice facility at the Sunrisers Hyderabad home ground. 6 turf wickets, video analysis, and professional equipment.',
 2400, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 1),

-- PUNE - Football
(17, 'Balewadi Sports Complex Football Turf', 'Baner, Pune', 'Football',
 'Olympic-standard football facility. Natural grass pitch with excellent maintenance. Hosted FIFA U-17 World Cup matches.',
 2600, 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800', 1),

-- BANGALORE - Tennis
(18, 'Karnataka State Lawn Tennis Association', 'Cubbon Park, Bangalore', 'Tennis',
 '12 synthetic courts with night lighting. Professional coaching and equipment rental available. Hosts state-level tournaments.',
 800, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', 2),

-- DELHI - Basketball
(19, 'Thyagaraj Sports Complex Basketball', 'INA, New Delhi', 'Basketball',
 'Modern indoor basketball facility with 2 courts. Wooden flooring, AC, and professional lighting. Popular for corporate leagues.',
 1100, 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800', 2),

-- BANGALORE - Multi-Sport
(20, 'Decathlon Sports Arena', 'Whitefield, Bangalore', 'Multi-Sport',
 'Multi-purpose sports facility with badminton, basketball, and volleyball courts. Modern amenities, equipment rental, and cafe.',
 600, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 2);

-- Reset sequence
ALTER SEQUENCE ground_id_seq RESTART WITH 21;
ALTER SEQUENCE users_id_seq RESTART WITH 4;
