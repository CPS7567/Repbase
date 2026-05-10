-- ============================================
-- TASK 4: SQL QUERIES (UI + DATABASE MATCHING)
-- ============================================


-- 1. Get all members (Profile/Admin view)
SELECT * FROM member;


-- 2. Get membership details for a member (Membership Page)
SELECT m.name, ms.status, ms.expiry_date, mp.plan_name
FROM member m
JOIN membership ms ON m.member_id = ms.member_id
JOIN membership_plan mp ON ms.plan_id = mp.plan_id
WHERE m.member_id = 1;


-- 3. Get all membership plans (Membership Catalog UI)
SELECT plan_name, duration, price, access_level
FROM membership_plan;


-- 4. Get all workout sessions of a member (History Page)
SELECT session_id, workout_date, duration
FROM workout_session
WHERE member_id = 1
ORDER BY workout_date DESC;


-- 5. Count total workouts of a member (Profile stats)
SELECT COUNT(*) AS total_workouts
FROM workout_session
WHERE member_id = 1;


-- 6. Get exercises list (Exercise picker UI)
SELECT exercise_name, equipment, exercise_type
FROM exercise;


-- 7. Get exercises performed in a workout (Workout Detail Page)
SELECT sl.session_id, e.exercise_name, sl.reps, sl.weight
FROM set_log sl
JOIN exercise e ON sl.exercise_id = e.exercise_id
WHERE sl.session_id = 1;


-- 8. Total sets per workout (Workout Detail / Stats)
SELECT session_id, COUNT(*) AS total_sets
FROM set_log
WHERE session_id = 1
GROUP BY session_id;


-- 9. Calculate workout volume (Workout Summary UI)
SELECT session_id, SUM(reps * weight) AS total_volume
FROM set_log
WHERE session_id = 1
GROUP BY session_id;


-- 10. Get payments of a member (Membership/Payment history)
SELECT payment_date, amount, payment_method, payment_status
FROM payment
WHERE member_id = 1;


-- 11. Total revenue (Admin Dashboard)
SELECT SUM(amount) AS total_revenue
FROM payment
WHERE payment_status = 'Completed';


-- 12. Active members (Admin Dashboard)
SELECT m.name, ms.status
FROM member m
JOIN membership ms ON m.member_id = ms.member_id
WHERE ms.status = 'Active';


-- 13. Members per gym (Admin stats)
SELECT g.gym_name, COUNT(m.member_id) AS total_members
FROM gym g
LEFT JOIN member m ON g.gym_id = m.gym_id
GROUP BY g.gym_name;


-- 14. Most performed exercises (Analytics / Admin)
SELECT e.exercise_name, COUNT(sl.exercise_id) AS frequency
FROM set_log sl
JOIN exercise e ON sl.exercise_id = e.exercise_id
GROUP BY e.exercise_name
ORDER BY frequency DESC;


-- 15. Muscle groups for an exercise (Exercise detail logic)
SELECT e.exercise_name, m.muscle_name
FROM exercise e
JOIN exercise_muscle em ON e.exercise_id = em.exercise_id
JOIN muscle m ON em.muscle_id = m.muscle_id
WHERE e.exercise_id = 1;