import { useState } from "react";
import Home from './pages/Home';
import ActiveWorkout from './pages/ActiveWorkout';
import Membership from './pages/Membership';
import WorkoutMenu from "./pages/WorkoutMenu";
import History from "./pages/History";
import WorkoutDetail from "./pages/WorkoutDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NavBar from './components/NavBar';
import LoginPage from "./pages/LoginPage";
import { WORKOUT_HISTORY, ROUTINES } from './utils/constants';
import { C, SANS } from "./utils/theme";
import DevDashboard, { SEED_GYMS, SEED_ADMINS, SEED_USERS } from './pages/DevDashboard';
import ManageGyms from './pages/ManageGyms';
import ManageAdmins from './pages/ManageAdmins';

export default function App() {
    const [page, setPage] = useState("home");
    const [sessions, setSessions] = useState(WORKOUT_HISTORY);
    const [role, setRole] = useState("Member");
    const [selectedSession, setSelectedSession] = useState(null);
    const [logging, setLogging] = useState(false);
    const [loggingRoutine, setLoggingRoutine] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [gyms, setGyms] = useState(SEED_GYMS);
    const [admins, setAdmins] = useState(SEED_ADMINS);
    const [users, setUsers] = useState(SEED_USERS);

    function handleFinishWorkout(exs, elapsed) {
        const vol = exs.reduce((a, ex) => a + ex.sets.filter(s => s.done).reduce((b, s) => b + (s.kg * s.reps), 0), 0);
        const newSession = {
            id: Date.now(), name: "My Workout",
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase(),
            duration: Math.round(elapsed / 60) || 1,
            volume: vol,
            exercises: exs.map(ex => ({ id: ex.id, name: ex.name, sets: ex.sets.map((s, i) => ({ no: i + 1, kg: s.kg, reps: s.reps })) })),
        };
        setSessions(p => [newSession, ...p]);
        setLogging(false); setLoggingRoutine(null); setPage("history");
    }

    function handleLogin(user) {
        // In a real app, you'd validate credentials against a backend.
        // Here, we'll just simulate a successful login.
        setAuthenticated(true);
        // You could also set the user role based on the response from the server
        // For now, we'll just leave it as "Member" or determine based on email
        if (user.email.includes("admin")) {
            setRole("Admin");
        } else if (user.email.includes("dev")) {
            setRole("Dev");
        }
        else {
            setRole("Member");
        }
        setPage("home");
    }

    function handleLogout() {
        setAuthenticated(false);
        setRole("Member");
        setPage("home");
    }

    if (!authenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div style={{ background: C.bg, minHeight: "100vh", fontFamily: SANS, color: C.text }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                *{margin:0;box-sizing:border-box;}
                ::-webkit-scrollbar{width:4px;height:4px;}
                ::-webkit-scrollbar-track{background:transparent;}
                ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
                input:focus{border-color:${C.accent}!important;outline:none;}
                select option{background:${C.surface};color:${C.text};}
                input[type=number]::-webkit-inner-spin-button{opacity:0.3;}
            `}</style>

            <NavBar
                page={logging ? "workout" : selectedSession ? "history" : page}
                setPage={p => {
                    if (p === 'admin' && role === 'Dev') {
                        setPage('dev-dashboard');
                        return;
                    }
                    if (p !== page || logging || selectedSession) {
                        setLogging(false);
                        setLoggingRoutine(null);
                        setSelectedSession(null);
                        setPage(p);
                    }
                }}
                role={role} setRole={setRole}
                onLogout={handleLogout}
            />

            {logging ? (
                <ActiveWorkout
                    initialRoutine={loggingRoutine}
                    onFinish={handleFinishWorkout}
                    onDiscard={() => { setLogging(false); setLoggingRoutine(null); }}
                />
            ) : selectedSession ? (
                <WorkoutDetail session={selectedSession} onBack={() => setSelectedSession(null)} />
            ) : page === "home" ? (
                <Home sessions={sessions} />
            ) : page === "membership" ? (
                <Membership />
            ) : page === "workout" ? (
                <WorkoutMenu
                    onStartWorkout={() => { setLoggingRoutine(null); setLogging(true); }}
                    onStartRoutine={r => { setLoggingRoutine(r); setLogging(true); }}
                    routines={ROUTINES}
                />
            ) : page === "history" ? (
                <History sessions={sessions} onSelect={s => { setSelectedSession(s); }} />
            ) : page === "profile" ? (
                <Profile sessions={sessions} />
            ) : page === "admin" && role === "Admin" ? (
                <Admin sessions={sessions} />
            ) : page === "dev-dashboard" && role === "Dev" ? (
                <DevDashboard
                    gyms={gyms}
                    admins={admins}
                    users={users}
                    onManageGyms={() => setPage('manage-gyms')}
                    onManageAdmins={() => setPage('manage-admins')}
                />
            ) : page === "manage-gyms" && role === "Dev" ? (
                <ManageGyms gyms={gyms} setGyms={setGyms} onBack={() => setPage('dev-dashboard')} />
            ) : page === "manage-admins" && role === "Dev" ? (
                <ManageAdmins admins={admins} setAdmins={setAdmins} gyms={gyms} onBack={() => setPage('dev-dashboard')} />
            ) : null}
        </div>
    );
}