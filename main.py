import mysql.connector
from mysql.connector import Error

class DatabaseManager:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': 'harsh@102',
            'database': 'repbase'
        }

    def _get_connection(self):
        try:
            return mysql.connector.connect(**self.db_config)
        except Error as e:
            print(f"Connection Error: {e}")
            return None

    def _execute_write(self, query, params=(), return_id=False):
        """Helper to cleanly execute all INSERT, UPDATE, and DELETE commands."""
        conn = self._get_connection()
        if not conn:
            return {"status": "error", "message": "Connection failed"}
        try:
            cursor = conn.cursor(prepared=True)
            cursor.execute(query, params)
            conn.commit()
            
            if return_id:
                return {"status": "success", "id": cursor.lastrowid}
            return {"status": "success", "rows_affected": cursor.rowcount}
        except Error as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    # ==========================================
    # 1. GYM MANAGEMENT
    # ==========================================
    def insert_gym(self, name, location, contact):
        query = "INSERT INTO gym (gym_name, location, contact_number) VALUES (%s, %s, %s)"
        return self._execute_write(query, (name, location, contact), return_id=True)

    def update_gym(self, gym_id, name, location, contact):
        query = "UPDATE gym SET gym_name=%s, location=%s, contact_number=%s WHERE gym_id=%s"
        return self._execute_write(query, (name, location, contact, gym_id))

    def delete_gym(self, gym_id):
        query = "DELETE FROM gym WHERE gym_id=%s"
        return self._execute_write(query, (gym_id,))
    

    def insert_gym_admin(self, name, email, phone, gym_id, user_id):

        query = """
        INSERT INTO gym_admin (name, email, phone, gym_id, user_id)
        VALUES (%s, %s, %s, %s, %s)
        """

        return self._execute_write(
            query,
            (name, email, phone, gym_id, user_id),
            return_id=True
        )
    def update_gym_admin(self, user_id, name, email, phone):

        query = """
        UPDATE gym_admin
        SET name=%s, email=%s, phone=%s
        WHERE user_id=%s
        """

        return self._execute_write(
            query,
            (name, email, phone, user_id)
        )
    # ==========================================
    # 2. MEMBERS & MEMBERSHIPS
    # ==========================================
    def insert_member(self, name, dob, gender, email, phone, gym_id, user_id):
        query = """INSERT INTO member (name, date_of_birth, gender, email, phone, gym_id ,user_id) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        return self._execute_write(query, (name, dob, gender, email, phone, gym_id, user_id), return_id=True)

    def update_member(self, member_id, name, email, phone):
        query = "UPDATE member SET name=%s, email=%s, phone=%s WHERE member_id=%s"
        return self._execute_write(query, (name, email, phone, member_id))
    
    def get_gym_id(self , user_id):
        conn = self._get_connection()

        try:
            cursor = conn.cursor(dictionary=True)

            query = """
            SELECT gym_id
            FROM gym_admin
            WHERE user_id=%s
            """

            cursor.execute(query, (user_id,))

            result = cursor.fetchone()

            if result:
                return {"status": "success", "gym_id": result["gym_id"]}

            return {"status": "error", "message": "Gym not found for this admin"}
        except Error as e:
            return {"status": "error", "message": str(e)}
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    def get_member_id(self, user_id, gym_id):

        conn = self._get_connection()

        try:
            cursor = conn.cursor(dictionary=True)

            query = """
            SELECT member_id
            FROM member
            WHERE user_id=%s AND gym_id=%s
            """

            cursor.execute(query, (user_id, gym_id))

            result = cursor.fetchone()

            if result:
                return {"status": "success", "member_id": result["member_id"]}

            return {"status": "error", "message": "Member not found"}

        except Error as e:
            return {"status": "error", "message": str(e)}

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    def insert_plan(self, plan_name, duration, price , access_level , gym_id):
        query = "INSERT INTO membership_plan (plan_name, duration,  price , access_level , gym_id) VALUES (%s, %s, %s, %s, %s)"
        return self._execute_write(query, (plan_name, duration, price , access_level , gym_id), return_id=True)

    def update_plan(self, plan_id,gym_id ,  plan_name, duration, price , access_level):
        query = "UPDATE membership_plan SET plan_name=%s, duration=%s, price=%s, access_level=%s WHERE plan_id=%s AND gym_id=%s"
        return self._execute_write(query, (plan_name, duration, price , access_level , plan_id, gym_id))
    
    def currently_active_membership(self, member_id):
        conn = self._get_connection()

        try:
            cursor = conn.cursor(dictionary=True)

            query = """
            SELECT plan_id, status FROM membership WHERE member_id=%s
            """

            cursor.execute(query, (member_id,))

            result = cursor.fetchone()

            if result:
                return {"status": "success", "membership_status": result["status"] , "plan_id": result["plan_id"]}

            return {"status": "error", "message": "Membership not found for this member"}

        except Error as e:
            return {"status": "error", "message": str(e)}

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    def delete_plan(self, plan_id):
        q = "DELETE FROM membership WHERE plan_id=%s"
        w = self._execute_write(q, (plan_id,))


        query = "DELETE FROM membership_plan WHERE plan_id=%s"

        return self._execute_write(query, (plan_id,))

    def insert_membership(self, member_id, plan_id, start_date, expiry_date, status):

        conn = self._get_connection()

        try:
            cursor = conn.cursor(dictionary=True)

            # Check if membership already exists
            check_query = """
            SELECT status FROM membership WHERE member_id=%s
            """
            cursor.execute(check_query, (member_id,))
            result = cursor.fetchone()

            # If no previous membership → INSERT
            if not result:
                query = """
                INSERT INTO membership (member_id, plan_id, start_date, expiry_date, status)
                VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(query, (member_id, plan_id, start_date, expiry_date, status))

            else:
                previous_status = result["status"]

                # If previous membership inactive → update start_date
                if previous_status == "Inactive":
                    query = """
                    UPDATE membership
                    SET plan_id=%s,
                        start_date=%s,
                        expiry_date=%s,
                        status=%s
                    WHERE member_id=%s
                    """
                    cursor.execute(query, (plan_id, start_date, expiry_date, status, member_id))

                # If active → do not change start_date
                else:
                    query = """
                    UPDATE membership
                    SET plan_id=%s,
                        expiry_date=%s,
                        status=%s
                    WHERE member_id=%s
                    """
                    cursor.execute(query, (plan_id, expiry_date, status, member_id))

            conn.commit()

            return {"status": "success"}

        except Error as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    def insert_trainer(self, name, specialization, phone, schedule, gym_id, user_id):
        query = """INSERT INTO trainer (name, specialization, phone, schedule, gym_id ,user_id) 
                   VALUES (%s, %s, %s, %s, %s, %s)"""
        return self._execute_write(query, (name, specialization, phone, schedule, gym_id, user_id), return_id=True)
    
    def update_trainer(self, trainer_id, name, specialization, phone, schedule):
        query = "UPDATE trainer SET name=%s, specialization=%s, phone=%s, schedule=%s WHERE trainer_id=%s"
        return self._execute_write(query, (name, specialization, phone, schedule, trainer_id))
    
    
    def update_membership_status(self, member_id, status):
        query = "UPDATE membership SET status=%s WHERE member_id=%s"
        return self._execute_write(query, (status, member_id))

    def delete_member_cascade(self, member_id):
        """
        Task 6 (Transactions): Deleting a member requires deleting their child records first 
        to avoid Foreign Key constraint errors.
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor(prepared=True)
            conn.start_transaction()
            
            # Delete in order of dependencies
            cursor.execute("DELETE FROM payment WHERE member_id=%s", (member_id,))
            cursor.execute("DELETE FROM membership WHERE member_id=%s", (member_id,))
            
            # Sub-query to delete set_log for all sessions owned by this member
            cursor.execute("""DELETE FROM set_log WHERE session_id IN 
                              (SELECT session_id FROM workout_session WHERE member_id=%s)""", (member_id,))
            cursor.execute("DELETE FROM workout_session WHERE member_id=%s", (member_id,))
            cursor.execute("DELETE FROM member WHERE member_id=%s", (member_id,))
            
            conn.commit()
            return {"status": "success", "message": "Member and all associated data deleted."}
        except Error as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    # ==========================================
    # 3. WORKOUTS (THE HEVY CLONE LOGIC)
    # ==========================================
    def insert_workout_session(self, workout_date, duration, member_id):
        # Will trigger your 'check_membership_before_workout' logic automatically
        query = "INSERT INTO workout_session (workout_date, duration, member_id) VALUES (%s, %s, %s)"
        return self._execute_write(query, (workout_date, duration, member_id), return_id=True)

    def update_workout_duration(self, session_id, duration):
        query = "UPDATE workout_session SET duration=%s WHERE session_id=%s"
        return self._execute_write(query, (duration, session_id))

    def insert_set_log(self, session_id, set_no, exercise_id, reps, weight):
        # PK is composite: session_id + set_no
        query = """INSERT INTO set_log (session_id, set_no, exercise_id, reps, weight) 
                   VALUES (%s, %s, %s, %s, %s)"""
        return self._execute_write(query, (session_id, set_no, exercise_id, reps, weight))

    def update_set_log(self, session_id, set_no, reps, weight):
        query = "UPDATE set_log SET reps=%s, weight=%s WHERE session_id=%s AND set_no=%s"
        return self._execute_write(query, (reps, weight, session_id, set_no))

    def delete_workout_cascade(self, session_id):
        """Atomic deletion for a workout and its sets."""
        conn = self._get_connection()
        try:
            cursor = conn.cursor(prepared=True)
            conn.start_transaction()
            cursor.execute("DELETE FROM set_log WHERE session_id=%s", (session_id,))
            cursor.execute("DELETE FROM workout_session WHERE session_id=%s", (session_id,))
            conn.commit()
            return {"status": "success", "message": "Workout deleted."}
        except Error as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

    # ==========================================
    # 4. EXERCISE DICTIONARY 
    # ==========================================
    def insert_exercise(self, exercise_id, name, equipment, ex_type):
        # We assume you manually assign exercise_id to map cleanly to your static muscle data
        query = "INSERT INTO exercise (exercise_id, exercise_name, equipment, exercise_type) VALUES (%s, %s, %s, %s)"
        return self._execute_write(query, (exercise_id, name, equipment, ex_type))

    def update_exercise(self, exercise_id, name, equipment):
        query = "UPDATE exercise SET exercise_name=%s, equipment=%s WHERE exercise_id=%s"
        return self._execute_write(query, (name, equipment, exercise_id))

    def delete_exercise(self, exercise_id):
        # Note: Must delete from exercise_muscle first due to FK
        conn = self._get_connection()
        try:
            cursor = conn.cursor(prepared=True)
            conn.start_transaction()
            cursor.execute("DELETE FROM exercise_muscle WHERE exercise_id=%s", (exercise_id,))
            cursor.execute("DELETE FROM exercise WHERE exercise_id=%s", (exercise_id,))
            conn.commit()
            return {"status": "success", "message": "Exercise deleted."}
        except Error as e:
            conn.rollback()
            return {"status": "error", "message": str(e)}
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()