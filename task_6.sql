-- WR Conflict → Dirty Read
-- T1
START TRANSACTION;
UPDATE member SET phone = '12345678' WHERE member_id = 3;
-- NOT COMMITTED
-- T2
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT phone FROM member WHERE member_id = 3;



-- “T2 reads uncommitted data written by T1 → WR conflict (dirty read).”

-- RW Conflict → Unrepeatable Read
-- T1
START TRANSACTION;
SELECT email FROM member WHERE member_id = 3;
-- T2
START TRANSACTION;
UPDATE member SET email = 'harsh@gmail.com' WHERE member_id = 3;
COMMIT;
-- T1 again:
SELECT email FROM member WHERE member_id = 3;
COMMIT;

-- Same query gives different results → unrepeatable read (RW conflict).



-- WW Conflict → Lost Update
-- T1
START TRANSACTION;
UPDATE membership_plan SET duration = 40 WHERE plan_id = 1;
-- T2
START TRANSACTION;
UPDATE membership_plan SET duration = 50 WHERE plan_id = 1;
COMMIT;
-- T1
COMMIT;

-- T2 overwrites T1 → lost update (WW conflict).


-- ROLLBACK
START TRANSACTION;

-- Invalid amount (violates CHECK amount > 0)
INSERT INTO payment (payment_date, amount, payment_method, payment_status, member_id)
VALUES (CURDATE(), -100, 'UPI', 'Completed', 1);

ROLLBACK;





START TRANSACTION;

-- Step 1: Update membership plan (user upgrades/renews)
UPDATE membership
SET plan_id = 2
WHERE member_id = 1;

-- Step 2: Insert payment (this will trigger auto-update)
INSERT INTO payment (payment_date, amount, payment_method, payment_status, member_id)
VALUES (CURDATE(), 4000.00, 'UPI', 'Completed', 1);

COMMIT;