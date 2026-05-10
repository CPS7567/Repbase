/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { C, SANS } from '../utils/theme';
import { StatPill } from '../components/shared/StatPill';
import { EXERCISES_DB } from '../utils/constants';
import ExercisePicker from "../components/ExercisePicker";
import { Btn } from '../components/shared/Btn';
import { Divider } from '../components/shared/Divider';

export default function ActiveWorkout({ initialRoutine, onFinish, onDiscard }) {
  // State Initialization
  const [exs, setExs] = useState(
    initialRoutine
      ? initialRoutine.exercises.map(id => {
          const e = EXERCISES_DB.find(x => x.id === id);
          return { ...e, sets: [{ no: 1, kg: 0, reps: 10, done: false }], notes: "" };
        })
      : []
  );
  const [showPicker, setShowPicker] = useState(false);
  
  // Timer State
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(null); // null | seconds
  const timerRef = useRef();
  const restRef = useRef();

  useEffect(()=>{
    timerRef.current = setInterval(()=>setElapsed(e=>e+1),1000);
    return ()=>clearInterval(timerRef.current);
  },[]);

  useEffect(()=>{
    if(restTimer===null) return;
    if(restTimer<=0){ setRestTimer(null); return; }
    restRef.current = setTimeout(()=>setRestTimer(r=>r-1),1000);
    return()=>clearTimeout(restRef.current);
  },[restTimer]);

  // Calculations
  const totalVol = exs.reduce((a, ex) => a + ex.sets.filter(s => s.done).reduce((b, s) => b + (s.kg * s.reps), 0), 0);
  const totalSets = exs.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0);
  const fmt = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  
  // Helper functions
  function addExercise(ex) { setExs(p=>[...p,{...ex,sets:[{no:1,kg:0,reps:10,done:false}],notes:""}]); setShowPicker(false); }
  function addSet(ei) { setExs(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:[...ex.sets,{no:ex.sets.length+1,kg:ex.sets.at(-1)?.kg||0,reps:ex.sets.at(-1)?.reps||10,done:false}]})); }
  function updateSet(ei,si,field,val) { setExs(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:ex.sets.map((s,j)=>j!==si?s:{...s,[field]:field==="done"?val:parseFloat(val)||0})})); }
  function toggleDone(ei,si) {
    updateSet(ei,si,"done",!exs[ei].sets[si].done);
    setRestTimer(180); // 3min rest
  }
  function removeSet(ei,si) { setExs(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:ex.sets.filter((_,j)=>j!==si).map((s,j)=>({...s,no:j+1}))})); }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px 40px" }}>
      {showPicker && <ExercisePicker onSelect={addExercise} onClose={()=>setShowPicker(false)}/>}

      {/* Sticky header */}
      <div style={{position:"sticky",top:52,background:C.bg,zIndex:50,padding:"14px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={onDiscard} style={{background:"none",border:"none",cursor:"pointer",color:C.textSub}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 9l-7 7-7-7"/></svg>
            </button>
            <span style={{fontFamily:SANS,fontSize:15,fontWeight:600,color:C.text}}>Log Workout</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <button onClick={()=>onFinish(exs,elapsed)} style={{
              background:C.accent,border:"none",borderRadius:8,padding:"7px 20px",
              color:"#fff",fontSize:13,fontWeight:600,fontFamily:SANS,cursor:"pointer",
            }}>Finish</button>
          </div>
        </div>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          <StatPill label="Duration" value={<span style={{color:C.accentBright}}>{fmt(elapsed)}</span>} accent/>
          <StatPill label="Volume" value={`${totalVol.toLocaleString()} kg`}/>
          <StatPill label="Sets" value={totalSets}/>
          {/* Rest timer */}
          {restTimer!==null && (
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,background:C.accentDim,border:`1px solid ${C.accent}`,borderRadius:8,padding:"4px 12px"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span style={{fontFamily:SANS,fontSize:12,color:C.accentBright,fontWeight:600}}>Rest: {Math.floor(restTimer/60)}min {restTimer%60}s</span>
              <button onClick={()=>setRestTimer(null)} style={{background:"none",border:"none",color:C.textSub,cursor:"pointer",fontSize:14,lineHeight:1}}>×</button>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {exs.length===0 && (
        <div style={{textAlign:"center",padding:"80px 0 40px"}}>
          <div style={{marginBottom:16}}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.2" strokeLinecap="round" style={{display:"block",margin:"0 auto"}}><path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12"/></svg>
          </div>
          <div style={{fontFamily:SANS,fontSize:16,fontWeight:600,color:C.text,marginBottom:6}}>Get started</div>
          <div style={{fontFamily:SANS,fontSize:13,color:C.textSub,marginBottom:28}}>Add an exercise to start your workout</div>
          <Btn onClick={()=>setShowPicker(true)} style={{padding:"11px 32px",fontSize:14}}>+ Add Exercise</Btn>
        </div>
      )}

      {/* Exercise cards */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {exs.map((ex,ei)=>(
          <div key={ei} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
            {/* Exercise header */}
            <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="1.8" strokeLinecap="round"><path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12"/></svg>
              </div>
              <span style={{fontFamily:SANS,fontSize:14,fontWeight:600,color:C.accentBright,flex:1}}>{ex.name}</span>
              <button style={{background:"none",border:"none",color:C.textSub,cursor:"pointer",fontSize:18,lineHeight:1}}>⋯</button>
            </div>

            {/* Notes */}
            <div style={{padding:"0 18px 10px"}}>
              <input placeholder="Add notes here..." style={{
                width:"100%",background:"none",border:"none",color:C.textSub,fontFamily:SANS,
                fontSize:12,outline:"none",boxSizing:"border-box",
              }}/>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span style={{fontFamily:SANS,fontSize:12,color:C.accentBright}}>Rest Timer: 3min 0s</span>
              </div>
            </div>

            <Divider/>

            {/* Set table header */}
            <div style={{display:"grid",gridTemplateColumns:"44px 1fr 80px 80px 44px",padding:"8px 18px",gap:8}}>
              {["SET","PREVIOUS","KG","REPS",""].map(h=>(
                <div key={h} style={{fontFamily:SANS,fontSize:10,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.06em",textAlign:h==="KG"||h==="REPS"?"center":"left"}}>{h}</div>
              ))}
            </div>

            {/* Sets */}
            {ex.sets.map((set,si)=>{
              const done = set.done;
              return (
                <div key={si} style={{
                  display:"grid",gridTemplateColumns:"44px 1fr 80px 80px 44px",
                  padding:"6px 18px",gap:8,alignItems:"center",
                  background: done ? "rgba(30,155,204,0.06)" : "transparent",
                  borderTop:`1px solid ${C.border}`,
                }}>
                  {/* Set label */}
                  <div style={{fontFamily:SANS,fontSize:13,fontWeight:700,color:done?C.accentBright:C.textSub,textAlign:"left"}}>
                    {set.no==="W"||set.no==="D" ? <span style={{color:set.no==="D"?C.accentBright:C.amber}}>{set.no}</span> : set.no}
                  </div>
                  {/* Previous */}
                  <div style={{fontFamily:SANS,fontSize:12,color:C.textDim}}>{si>0?`${ex.sets[si-1].kg}kg × ${ex.sets[si-1].reps}`:"—"}</div>
                  {/* KG */}
                  <input type="number" min="0" step="0.5" value={set.kg} onChange={e=>updateSet(ei,si,"kg",e.target.value)}
                    style={{background:done?"rgba(30,155,204,0.1)":C.surface,border:`1px solid ${done?C.accent:C.border}`,borderRadius:6,padding:"6px",color:C.text,fontFamily:SANS,fontSize:13,fontWeight:600,textAlign:"center",width:"100%",boxSizing:"border-box",outline:"none"}}
                  />
                  {/* Reps */}
                  <input type="number" min="0" value={set.reps} onChange={e=>updateSet(ei,si,"reps",e.target.value)}
                    style={{background:done?"rgba(30,155,204,0.1)":C.surface,border:`1px solid ${done?C.accent:C.border}`,borderRadius:6,padding:"6px",color:C.text,fontFamily:SANS,fontSize:13,fontWeight:600,textAlign:"center",width:"100%",boxSizing:"border-box",outline:"none"}}
                  />
                  {/* Check */}
                  <button onClick={()=>toggleDone(ei,si)} style={{
                    width:28,height:28,borderRadius:6,border:`1.5px solid ${done?C.accent:C.borderMid}`,
                    background:done?C.accent:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  }}>
                    {done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                  </button>
                </div>
              );
            })}

            {/* Add Set */}
            <button onClick={()=>addSet(ei)} style={{
              width:"100%",background:"none",border:"none",borderTop:`1px solid ${C.border}`,
              color:C.textSub,fontFamily:SANS,fontSize:13,cursor:"pointer",padding:"12px",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            }}
              onMouseEnter={e=>e.currentTarget.style.background=C.cardHover}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Bottom controls */}
      {exs.length>0 && (
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>
          <button onClick={()=>setShowPicker(true)} style={{
            width:"100%",background:C.accent,border:"none",borderRadius:10,
            padding:"12px",color:"#fff",fontSize:14,fontWeight:600,fontFamily:SANS,cursor:"pointer",
          }}>+ Add Exercise</button>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Btn variant="ghost" style={{width:"100%",textAlign:"center"}}>Settings</Btn>
            <Btn variant="danger" onClick={onDiscard} style={{width:"100%",textAlign:"center"}}>Discard Workout</Btn>
          </div>
        </div>
      )}
      {exs.length===0 && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
          <Btn variant="ghost" style={{textAlign:"center"}}>Settings</Btn>
          <Btn variant="danger" onClick={onDiscard} style={{textAlign:"center"}}>Discard Workout</Btn>
        </div>
      )}
    </div>
  );
}