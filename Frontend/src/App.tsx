import { useEffect, useRef, useState } from 'react';
import { Browser } from '@capacitor/browser';
import AndroidNotepad from './AndroidNotepad';
import timeFlowLogo from './TimeFlow Geometric Logo.png';

async function openExternalLink(event: { preventDefault: () => void }, url: string) {
  event.preventDefault();
  try {
    await Browser.open({ url });
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const TARGET_KEY = 'timerdate-target';
const BG_KEY = 'timerdate-bg';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'TimeFlow';
const DEFAULT_BG = import.meta.env.VITE_DEFAULT_BG || '#36454F';
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || 'https://github.com/Lavish09-Mehra/TimeFlow';
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/lavish09dev';

function defaultTarget() {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1, 0, 1);
  nextYear.setHours(0, 0, 0, 0);
  return nextYear;
}

function loadTarget() {
  try {
    const saved = localStorage.getItem(TARGET_KEY);
    if (saved) {
      const parsed = new Date(saved);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  } catch {
    // Ignore storage errors and fall back to the default target.
  }
  return defaultTarget();
}

function toDateTimeInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const fmt = new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'short' });

const SEGS: Record<string, string> = {
  a: "12,2 48,2 54,8 48,14 12,14 6,8",
  b: "54,10 60,16 60,42 54,48 48,42 48,16",
  c: "54,52 60,58 60,84 54,90 48,84 48,58",
  d: "12,86 48,86 54,92 48,98 12,98 6,92",
  e: "6,52 12,58 12,84 6,90 0,84 0,58",
  f: "6,10 12,16 12,42 6,48 0,42 0,16",
  g: "12,44 48,44 54,50 48,56 12,56 6,50"
};
const MAP = ["abcdef", "bc", "abdeg", "abcdg", "bcfg", "acdfg", "acdefg", "abc", "abcdefg", "abcdfg"];
const UNITS = ["Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"];

function addMonths(d: Date, n: number) {
  const r = new Date(d);
  const day = d.getDate();
  r.setDate(1);
  r.setMonth(r.getMonth() + n);
  const dim = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
  r.setDate(Math.min(day, dim));
  return r;
}

function diff(now: Date, target: Date) {
  let m = (target.getFullYear() - now.getFullYear()) * 12 + target.getMonth() - now.getMonth();
  let anchor = addMonths(now, m);
  while (anchor > target) { m--; anchor = addMonths(now, m); }
  let ms = target.getTime() - anchor.getTime();
  const daysTotal = Math.floor(ms / 86400000);
  ms -= daysTotal * 86400000;
  const hours = Math.floor(ms / 3600000);
  ms -= hours * 3600000;
  const minutes = Math.floor(ms / 60000);
  ms -= minutes * 60000;
  const seconds = Math.floor(ms / 1000);
  const weeks = Math.floor(daysTotal / 7);
  const days = daysTotal % 7;
  return [m, weeks, days, hours, minutes, seconds];
}

function Digit({ value }: { value: number }) {
  const onSeg = (k: string) => MAP[value]?.includes(k);
  return (
    <svg viewBox="0 0 60 100" className="digit">
      {Object.entries(SEGS).map(([k, points]) => (
        <polygon key={k} points={points} className={`seg ${onSeg(k) ? 'on' : ''}`} />
      ))}
    </svg>
  );
}

export default function App() {
  const [target, setTarget] = useState<Date>(loadTarget);
  const [inputVal, setInputVal] = useState<string>(() => toDateTimeInput(loadTarget()));
  const [vals, setVals] = useState<number[]>([0,0,0,0,0,0]);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState('');
  const [blink, setBlink] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [changeTargetOpen, setChangeTargetOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [bgColor, setBgColor] = useState(() => {
    try {
      return localStorage.getItem(BG_KEY) || DEFAULT_BG;
    } catch {
      return DEFAULT_BG;
    }
  });
  const [whyOpen, setWhyOpen] = useState(false);
  const [whyText, setWhyText] = useState('');
  const [commitOpen, setCommitOpen] = useState(false);
  const [commitChecked, setCommitChecked] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<Date | null>(null);
  const [started, setStarted] = useState(() => localStorage.getItem('timerdate-setup') === 'done');
  const [noteToSelfOpen, setNoteToSelfOpen] = useState(false);
  const [noteChoice, setNoteChoice] = useState<'stay' | 'giveup' | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  useEffect(() => {
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = bgColor;
    try {
      localStorage.setItem(BG_KEY, bgColor);
    } catch {
      // Ignore storage errors; the selected color still applies for this session.
    }
  }, [bgColor]);

  useEffect(() => {
    if (!started) return;
    try {
      localStorage.setItem(TARGET_KEY, target.toISOString());
    } catch {
      // Ignore storage errors; the countdown still runs for this session.
    }
  }, [target, started]);

  useEffect(() => {
    const tick = () => {
      if (!started) {
        setFinished(false);
        setVals([0,0,0,0,0,0]);
        setStatus('Set your target and start the timer.');
        return;
      }
      const now = new Date();
      const isFinished = target <= now;
      setFinished(isFinished);
      const v = isFinished ? [0,0,0,0,0,0] : diff(now, target);
      setVals(v as number[]);
      setStatus(isFinished ? `Time’s up. The target was ${fmt.format(target)}.` : `Counting down to ${fmt.format(target)}`);
      setBlink(s => !s);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target, started]);

  const start = () => {
    const d = new Date(inputVal);
    if (!inputVal || isNaN(d.getTime())) {
      setStatus('Pick a date and time first.');
      return;
    }
    if (localStorage.getItem('timerdate-setup') !== 'done') {
      setPendingTarget(d);
      setWhyText('');
      setCommitChecked(false);
      setWhyOpen(true);
      return;
    }
    setTarget(d);
    setStarted(true);
  };

  const proceedWhy = () => {
    if (!whyText.trim()) return;
    setWhyOpen(false);
    setCommitOpen(true);
  };

  const confirmRace = () => {
    if (!commitChecked || !pendingTarget) return;
    localStorage.setItem('timerdate-setup', 'done');
    localStorage.setItem('timerdate-why', whyText.trim());
    setTarget(pendingTarget);
    setStarted(true);
    setCommitOpen(false);
    setCommitChecked(false);
    setPendingTarget(null);
  };

  const settledLabel = pendingTarget
    ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(pendingTarget)
    : 'the settled date';

  const deleteData = () => {
    if (confirm('Delete all data? This cannot be undone.')) {
      localStorage.removeItem('stopwatch-v1');
      localStorage.removeItem('timerdate-setup');
      localStorage.removeItem('timerdate-why');
      localStorage.removeItem(TARGET_KEY);
      localStorage.removeItem(BG_KEY);
      localStorage.removeItem('android_notepad_todo_items');
      localStorage.removeItem('android_notepad_theme');
      localStorage.removeItem('timeflow_notepad_items_v1');
      localStorage.removeItem('jot-v1');
      window.dispatchEvent(new Event('timerdate-reset-notes'));
      // Reset countdown to the default next year
      const d = defaultTarget();
      setTarget(d);
      setInputVal(toDateTimeInput(d));
      setBgColor(DEFAULT_BG);
      setStarted(false);
      setStatus('Data cleared.');
      setSettingsOpen(false);
    }
  };

  const openChangeTarget = () => {
    setSettingsOpen(false);
    if (started) {
      setNoteChoice(null);
      setNoteToSelfOpen(true);
    } else {
      setChangeTargetOpen(true);
    }
  };

  const openNoteToSelf = () => {
    setNoteChoice(null);
    setNoteToSelfOpen(true);
  };

  return (
    <div style={{background:bgColor, minHeight:'100vh'}}>
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        style={{position:'fixed', top:'16px', right:'16px', zIndex:1000, background:'#1a1b20', border:'1px solid #353740', color:'#eceef5', borderRadius:'10px', padding:'8px 12px', cursor:'pointer'}}
        aria-label="Settings"
      >
        ⋮
      </button>
      {settingsOpen && (
        <div style={{position:'fixed', top:'60px', right:'16px', zIndex:1000, background:'#17181c', border:'1px solid #353740', borderRadius:'12px', padding:'8px', minWidth:'200px', boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
          <button onClick={openChangeTarget} style={{display:'block', width:'100%', textAlign:'left', background:'none', border:'none', color:'#eceef5', padding:'8px 12px', cursor:'pointer'}}>Change target date/time</button>
          <button onClick={()=>{setSettingsOpen(false); setBgPickerOpen(true);}} style={{display:'block', width:'100%', textAlign:'left', background:'none', border:'none', color:'#eceef5', padding:'8px 12px', cursor:'pointer'}}>Change background color</button>
          <button onClick={deleteData} style={{display:'block', width:'100%', textAlign:'left', background:'none', border:'none', color:'#eceef5', padding:'8px 12px', cursor:'pointer'}}>Delete data</button>
          <button onClick={()=>{setSettingsOpen(false); setAboutOpen(true);}} style={{display:'block', width:'100%', textAlign:'left', background:'none', border:'none', color:'#eceef5', padding:'8px 12px', cursor:'pointer'}}>About this project</button>
        </div>
      )}
      {changeTargetOpen && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1001}}>
          <div style={{background:'#1a1b20', padding:'20px', borderRadius:'12px', border:'1px solid #353740'}}>
            <h3 style={{margin:'0 0 12px', color:'#eceef5'}}>Change target date/time</h3>
            <input type="datetime-local" value={inputVal} onChange={e=>setInputVal(e.target.value)} style={{padding:'8px', borderRadius:'8px', border:'1px solid #353740', background:'#0f1115', color:'#eceef5'}} />
            <div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
              <button onClick={()=>{start(); setChangeTargetOpen(false);}} style={{padding:'8px 12px', borderRadius:'8px', border:'none', background:'#7aa2f7', color:'#0b0d12', cursor:'pointer'}}>Save</button>
              <button onClick={()=>setChangeTargetOpen(false)} style={{padding:'8px 12px', borderRadius:'8px', border:'1px solid #353740', background:'#1a1b20', color:'#eceef5', cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {aboutOpen && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1001}}>
          <div style={{background:'#1a1b20', padding:'24px', borderRadius:'12px', border:'1px solid #353740', width:'min(560px,100%)', maxHeight:'82vh', overflowY:'auto'}}>
            <h3 style={{margin:'0 0 14px', color:'#eceef5'}}>About this project</h3>
            <p style={{color:'#c4c7d1', fontSize:'14.5px', lineHeight:'1.75', margin:0}}>
              <strong style={{color:'#eceef5'}}>TimeFlow</strong> — the name says it: time flows endlessly and stops for no one. It just flows. We all see it, and many only watch. Some flow with time; some stay attached to a rocky past; and some change the flow to suit them. That is possible only when you work hard enough within that flow to make a change. That is the importance of time. If you respect time, you earn the time you dreamed of. So, to give respect to time, I made this project.
            </p>
            <p style={{color:'#c4c7d1', fontSize:'14.5px', lineHeight:'1.75', margin:'14px 0 0'}}>
              At last, you can install and customize it accordingly from my GitHub repo:{' '}
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={(e) => openExternalLink(e, GITHUB_URL)} style={{color:'#7aa2f7', wordBreak:'break-all', textDecoration:'underline'}}>{GITHUB_URL}</a>
            </p>
            <p style={{color:'#c4c7d1', fontSize:'14.5px', lineHeight:'1.75', margin:'14px 0 0'}}>
              If you like this concept, make sure to follow me on LinkedIn:{' '}
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" onClick={(e) => openExternalLink(e, LINKEDIN_URL)} style={{color:'#7aa2f7', wordBreak:'break-all', textDecoration:'underline'}}>{LINKEDIN_URL}</a>
            </p>
            <button onClick={()=>setAboutOpen(false)} style={{marginTop:'18px', padding:'9px 16px', borderRadius:'8px', border:'none', background:'#7aa2f7', color:'#0b0d12', cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
      {bgPickerOpen && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1001}}>
          <div style={{background:'#1a1b20', padding:'20px', borderRadius:'12px', border:'1px solid #353740', minWidth:'280px'}}>
            <h3 style={{margin:'0 0 12px', color:'#eceef5'}}>Change background color</h3>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <input
                type="color"
                value={bgColor}
                onChange={e=>setBgColor(e.target.value)}
                style={{width:'56px', height:'42px', border:'none', borderRadius:'8px', background:'transparent', cursor:'pointer'}}
              />
              <input
                type="text"
                value={bgColor}
                onChange={e=>setBgColor(e.target.value)}
                style={{flex:1, padding:'8px', borderRadius:'8px', border:'1px solid #353740', background:'#0f1115', color:'#eceef5'}}
              />
            </div>
            <div style={{display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap'}}>
              {['#36454F', '#1f2933', '#2f3e46', '#0f172a', '#3d2c2e', '#2b2d42'].map(c=>(
                <button key={c} onClick={()=>setBgColor(c)} title={c} style={{width:'32px', height:'32px', borderRadius:'50%', background:c, border: bgColor.toLowerCase()===c.toLowerCase() ? '3px solid #7aa2f7' : '2px solid #353740', cursor:'pointer'}} />
              ))}
            </div>
            <div style={{marginTop:'16px', display:'flex', gap:'8px'}}>
              <button onClick={()=>setBgPickerOpen(false)} style={{padding:'8px 12px', borderRadius:'8px', border:'none', background:'#7aa2f7', color:'#0b0d12', cursor:'pointer'}}>Done</button>
              <button onClick={()=>{setBgColor('#36454F');}} style={{padding:'8px 12px', borderRadius:'8px', border:'1px solid #353740', background:'#1a1b20', color:'#eceef5', cursor:'pointer'}}>Reset</button>
            </div>
          </div>
        </div>
      )}
      {whyOpen && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1002, padding:'16px'}}>
          <div style={{background:'#1a1b20', padding:'24px', borderRadius:'14px', border:'1px solid #353740', width:'min(480px,100%)'}}>
            <h3 style={{margin:'0 0 8px', color:'#eceef5'}}>Why?</h3>
            <p style={{margin:'0 0 14px', color:'#a9adbb', fontSize:'14px', lineHeight:'1.5'}}>
              Before the countdown begins, write the reason you cannot afford to quit.
            </p>
            <textarea
              autoFocus
              value={whyText}
              onChange={e=>setWhyText(e.target.value)}
              placeholder="Because…"
              rows={4}
              style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #353740', background:'#0f1115', color:'#eceef5', outline:'none', resize:'vertical', boxSizing:'border-box', font:'inherit'}}
            />
            <div style={{marginTop:'16px', display:'flex', justifyContent:'flex-end'}}>
              <button
                onClick={proceedWhy}
                disabled={!whyText.trim()}
                style={{padding:'9px 18px', borderRadius:'9px', border:'none', background:'#7aa2f7', color:'#0b0d12', cursor:whyText.trim() ? 'pointer' : 'not-allowed', opacity:whyText.trim() ? 1 : 0.45}}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {commitOpen && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1002, padding:'16px'}}>
          <div style={{background:'#1a1b20', padding:'24px', borderRadius:'14px', border:'1px solid #353740', width:'min(560px,100%)'}}>
            <h3 style={{margin:'0 0 10px', color:'#eceef5'}}>The Race</h3>
            <p style={{margin:'0 0 18px', color:'#c4c7d1', fontSize:'14.5px', lineHeight:'1.65'}}>
              Note: You’re entering the Race of You vs. Yourself. Until {settledLabel}, become the killer of your own weakness. Let every weak version of you die and every stronger version be born. Repeat until no weaker self remains. If you can conquer this, enter—otherwise, this battle is not for you.
            </p>
            <label style={{display:'flex', alignItems:'flex-start', gap:'10px', color:'#eceef5', fontSize:'14px', lineHeight:'1.45', cursor:'pointer'}}>
              <input
                type="checkbox"
                checked={commitChecked}
                onChange={e=>setCommitChecked(e.target.checked)}
                style={{marginTop:'3px', width:'17px', height:'17px', accentColor:'#7aa2f7', flex:'none'}}
              />
              <span>I accept. I’m entering the race.</span>
            </label>
            <div style={{marginTop:'18px', display:'flex', justifyContent:'flex-end'}}>
              <button
                onClick={confirmRace}
                disabled={!commitChecked}
                style={{padding:'9px 20px', borderRadius:'9px', border:'none', background:'#7aa2f7', color:'#0b0d12', cursor:commitChecked ? 'pointer' : 'not-allowed', opacity:commitChecked ? 1 : 0.45}}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
      {noteToSelfOpen && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1003, padding:'16px'}}>
          <div style={{background:'#1a1b20', padding:'24px', borderRadius:'14px', border:'1px solid #353740', width:'min(600px,100%)'}}>
            <h3 style={{margin:'0 0 14px', color:'#eceef5', letterSpacing:'0.07em', fontSize:'15px'}}>NOTE TO SELF</h3>
            <div style={{maxHeight:'48vh', overflowY:'auto', paddingRight:'6px'}}>
              <p style={{margin:0, color:'#d8dbe4', fontSize:'14.5px', lineHeight:'1.8', fontStyle:'italic'}}>
                Remember why you began. Remember the version of you who set this date—the one who looked at the distance and still chose to move. Time does not wait, and it does not judge. It simply watches what we do with the life we were given.
              </p>
              <p style={{margin:'14px 0 0', color:'#c4c7d1', fontSize:'14.5px', lineHeight:'1.8'}}>
                You do not have to be perfect. You only have to keep going. The weaker self will whisper, “later.” The stronger self answers, “now.” Let the old you fall away—quietly, but completely. Let the new you rise, not in one grand leap, but in every small refusal to surrender.
              </p>
              <p style={{margin:'14px 0 0', color:'#c4c7d1', fontSize:'14.5px', lineHeight:'1.8'}}>
                Your past self started this. Your present self must carry it. Your future self is standing at the end of this road, waiting to meet you. Do not betray the promise you made in the dark. No one else needs to know. This is between you and yourself.
              </p>
              <p style={{margin:'14px 0 0', color:'#eceef5', fontSize:'14.5px', lineHeight:'1.8', fontWeight:600}}>
                Don’t even think about changing the date. Change yourself. Achieve it. Snatch it from the world.
              </p>
              <p style={{margin:'14px 0 0', color:'#8e93a3', fontSize:'13px', lineHeight:'1.6'}}>
                Choose honestly.
              </p>
            </div>
            <div style={{marginTop:'18px', display:'flex', flexDirection:'column', gap:'12px'}}>
              <label style={{display:'flex', alignItems:'flex-start', gap:'10px', color:'#eceef5', fontSize:'14px', lineHeight:'1.45', cursor:'pointer'}}>
                <input
                  type="checkbox"
                  checked={noteChoice === 'stay'}
                  onChange={e=>{
                    if (e.target.checked) {
                      setNoteChoice('stay');
                      setNoteToSelfOpen(false);
                    } else {
                      setNoteChoice(null);
                    }
                  }}
                  style={{marginTop:'3px', width:'17px', height:'17px', accentColor:'#7aa2f7', flex:'none'}}
                />
                <span>I am sorry. I will not even think of quitting.<span style={{display:'block', color:'#8e93a3', fontSize:'12.5px', marginTop:'2px'}}>This takes you back home.</span></span>
              </label>
              <label style={{display:'flex', alignItems:'flex-start', gap:'10px', color:'#eceef5', fontSize:'14px', lineHeight:'1.45', cursor:'pointer'}}>
                <input
                  type="checkbox"
                  checked={noteChoice === 'giveup'}
                  onChange={e=>setNoteChoice(e.target.checked ? 'giveup' : null)}
                  style={{marginTop:'3px', width:'17px', height:'17px', accentColor:'#7aa2f7', flex:'none'}}
                />
                <span>I give up. The reason is me. Sorry to myself.<span style={{display:'block', color:'#8e93a3', fontSize:'12.5px', marginTop:'2px'}}>This unlocks the date change.</span></span>
              </label>
            </div>
            <div style={{marginTop:'18px', display:'flex', gap:'8px', justifyContent:'flex-end', flexWrap:'wrap'}}>
              <button onClick={()=>setNoteToSelfOpen(false)} style={{padding:'9px 18px', borderRadius:'9px', border:'1px solid #353740', background:'#1a1b20', color:'#eceef5', cursor:'pointer'}}>Close</button>
              <button
                onClick={()=>{setNoteToSelfOpen(false); setChangeTargetOpen(true);}}
                disabled={noteChoice !== 'giveup'}
                style={{padding:'9px 18px', borderRadius:'9px', border:'none', background:'#7aa2f7', color:'#0b0d12', cursor:noteChoice === 'giveup' ? 'pointer' : 'not-allowed', opacity:noteChoice === 'giveup' ? 1 : 0.45}}
              >
                Continue to change date
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{textAlign:'center', marginBottom:'2rem'}}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:'1.5rem'}}>
          <img
            src={timeFlowLogo}
            alt="TimeFlow"
            style={{
              width:'min(300px, 72vw)',
              height:'auto',
              filter:'brightness(0) invert(1)',
              opacity:0.95,
              userSelect:'none',
              pointerEvents:'none'
            }}
          />
        </div>

        <div className="bezel">
        <span className="screw"></span><span className="screw"></span><span className="screw"></span><span className="screw"></span>
        <div className="bezel-inner">
          <div className={`panel ${finished ? 'done' : ''}`} ref={panelRef} id="panel">
            <div className="groups" id="groups">
              {UNITS.map((name, i) => {
                const v = Math.min(99, Math.max(0, vals[i] ?? 0));
                const d1 = Math.floor(v / 10);
                const d2 = v % 10;
                return (
                  <>
                    <div className="group" key={name}>
                      <div className="pair">
                        <Digit value={d1} />
                        <Digit value={d2} />
                      </div>
                      <div className="label">{name}</div>
                    </div>
                    {i < UNITS.length - 1 && (
                      <div key={`c${i}`} className={`colon ${blink ? 'on' : ''}`}>
                        <i></i><i></i>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="controls">
        <label htmlFor="target">Target date and time</label>
        <input type="datetime-local" id="target" value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button id="set" onClick={started ? openNoteToSelf : start}>{started ? 'Change Date' : 'Start timer'}</button>
      </div>
      <p className="status" id="status">{status}</p>

      <div style={{display:'flex', alignItems:'center', gap:'0.75rem', width:'min(420px, 88vw)', margin:'1.75rem auto 0'}}>
        <span style={{flex:1, height:'1px', background:'rgba(236,238,245,0.12)'}} />
        <img
          src={timeFlowLogo}
          alt=""
          aria-hidden="true"
          style={{
            width:'140px',
            height:'auto',
            filter:'brightness(0) invert(1)',
            opacity:0.5,
            userSelect:'none',
            pointerEvents:'none'
          }}
        />
        <span style={{flex:1, height:'1px', background:'rgba(236,238,245,0.12)'}} />
      </div>

      {started && (
        <div style={{display:'flex', gap:'clamp(1.25rem, 2.5vw, 2rem)', justifyContent:'center', alignItems:'flex-start', flexWrap:'wrap', marginTop:'1.25rem'}}>
          <iframe src="/stopwatch.html" title="Stopwatch" style={{width:'min(420px,90vw)', height:'650px', border:'none', borderRadius:'12px', background:'transparent'}} />
          <div style={{width:'min(420px,90vw)', height:'650px', borderRadius:'12px', overflow:'hidden'}}>
            <AndroidNotepad />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
