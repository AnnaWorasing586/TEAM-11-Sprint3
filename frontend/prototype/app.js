(() => {
  const FOODS = [
    { name:'ข้าวผัดกะเพราไก่ไข่ดาว',     tag:'จานเดียว · 1 จาน',  kcal:620, protein:28, carbs:68, fat:26, sugar:6,  sodium:980,  confidence:94 },
    { name:'สลัดอกไก่ย่าง',                tag:'เมนูสุขภาพ · 1 ชาม', kcal:330, protein:35, carbs:18, fat:12, sugar:8,  sodium:540,  confidence:91 },
    { name:'ก๋วยเตี๋ยวต้มยำหมูสับ',       tag:'เส้น · 1 ชาม',        kcal:480, protein:22, carbs:64, fat:14, sugar:12, sodium:1240, confidence:96 },
    { name:'ข้าวมันไก่ต้ม',                 tag:'จานเดียว · 1 จาน',  kcal:590, protein:26, carbs:72, fat:22, sugar:4,  sodium:860,  confidence:93 },
    { name:'แซนด์วิชอกไก่โฮลวีต',        tag:'มื้อเบา · 1 ชิ้น',     kcal:410, protein:30, carbs:42, fat:14, sugar:7,  sodium:720,  confidence:90 },
    { name:'ส้มตำไทย',                       tag:'ยำ · 1 จาน',          kcal:180, protein:6,  carbs:30, fat:5,  sugar:18, sodium:1100, confidence:95 },
    { name:'ผัดไทยกุ้งสด',                  tag:'เส้น · 1 จาน',        kcal:560, protein:24, carbs:78, fat:18, sugar:16, sodium:920,  confidence:92 },
    { name:'ข้าวซอยไก่',                    tag:'เส้น · 1 ชาม',        kcal:650, protein:30, carbs:62, fat:32, sugar:8,  sodium:1180, confidence:90 },
    { name:'ต้มยำกุ้งน้ำข้น',                tag:'น้ำ · 1 ถ้วย',         kcal:280, protein:22, carbs:14, fat:16, sugar:6,  sodium:1420, confidence:94 },
    { name:'ลาบหมูคั่วข้าว',                tag:'ยำ · 1 จาน',          kcal:420, protein:32, carbs:18, fat:24, sugar:3,  sodium:980,  confidence:93 },
    { name:'ผัดซีอิ๊วเส้นใหญ่ไก่',        tag:'เส้น · 1 จาน',        kcal:680, protein:26, carbs:82, fat:24, sugar:10, sodium:1340, confidence:91 },
    { name:'ไข่เจียวหมูสับราดข้าว',     tag:'จานเดียว · 1 จาน',  kcal:540, protein:24, carbs:60, fat:24, sugar:3,  sodium:780,  confidence:95 },
    { name:'โจ๊กหมูใส่ไข่',                  tag:'มื้อเบา · 1 ชาม',     kcal:300, protein:18, carbs:42, fat:8,  sugar:2,  sodium:820,  confidence:92 },
    { name:'สุกี้แห้งทะเล',                  tag:'เส้น · 1 จาน',        kcal:520, protein:28, carbs:58, fat:18, sugar:9,  sodium:1260, confidence:90 },
    { name:'ข้าวเหนียวมะม่วง',            tag:'ขนมหวาน · 1 จาน',  kcal:480, protein:6,  carbs:88, fat:12, sugar:54, sodium:120,  confidence:96 },
    { name:'น้ำเต้าหู้หวานน้อย',          tag:'เครื่องดื่ม · 1 แก้ว', kcal:140, protein:8,  carbs:18, fat:4,  sugar:9,  sodium:90,   confidence:89 },
    { name:'ขนมจีนน้ำยากะทิ',              tag:'เส้น · 1 จาน',        kcal:530, protein:20, carbs:64, fat:22, sugar:8,  sodium:1080, confidence:92 },
    { name:'แกงเขียวหวานไก่กับข้าว', tag:'จานเดียว · 1 จาน',  kcal:610, protein:24, carbs:64, fat:28, sugar:9,  sodium:1320, confidence:93 },
    { name:'ไก่ทอดน่องติดสะโพก',        tag:'ของทอด · 2 ชิ้น',     kcal:420, protein:30, carbs:14, fat:26, sugar:1,  sodium:680,  confidence:94 },
    { name:'โยเกิร์ตกรีกใส่ผลไม้',       tag:'มื้อเบา · 1 ถ้วย',     kcal:210, protein:14, carbs:24, fat:6,  sugar:18, sodium:80,   confidence:88 },
  ];

  const ACCENTS = {
    green: ['#15a06a', '#e3f4ea'],
    blue:  ['#2f7df5', '#e7effd'],
    coral: ['#ff7a5c', '#ffeae3'],
  };

  const PREFS_KEY = 'nutriscan.prefs.v1';
  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      const out = {};
      if (typeof p.userName === 'string' && p.userName.trim()) out.userName = p.userName.trim().slice(0, 30);
      if (Number.isFinite(p.dailyGoal)) out.dailyGoal = Math.min(3500, Math.max(1200, Math.round(p.dailyGoal)));
      if (ACCENTS[p.accent]) out.accent = p.accent;
      return out;
    } catch (e) { return null; }
  }
  function savePrefs(s) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        userName:  s.userName,
        dailyGoal: s.dailyGoal,
        accent:    s.accent,
      }));
    } catch (e) {}
  }
  const PREFS = loadPrefs() || {};

  const state = {
    page: 'home',
    scanStage: 'idle',
    activeMode: 'food',
    servings: 1,
    resultFood: FOODS[0],
    consumed: 960,
    pConsumed: 62,
    cConsumed: 132,
    fConsumed: 38,
    accent: PREFS.accent ?? 'green',
    userName: PREFS.userName ?? 'พีรพล',
    dailyGoal: PREFS.dailyGoal ?? 2000,
    settingsDraft: null,
    meals: [
      { meal:'มื้อเช้า',    name:'โจ๊กหมูใส่ไข่',          kcal:300, time:'07:20', color:'#f5a524', tint:'#fdf2dd' },
      { meal:'มื้อกลางวัน', name:'ข้าวผัดกะเพราไก่',        kcal:540, time:'12:10', color:'#ff8a5b', tint:'#ffeae0' },
      { meal:'ของว่าง',    name:'นมถั่วเหลืองหวานน้อย', kcal:120, time:'15:30', color:'#4c8dff', tint:'#e6efff' },
    ],
  };

  let scanTimer = null;
  let lastPage = null;
  let cameraStream = null;
  let cameraTried = false;
  const root = document.getElementById('app-root');

  async function startCamera() {
    if (cameraStream) return;
    cameraTried = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      render();
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      render();
    } catch (err) {
      cameraStream = null;
      render();
    }
  }
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    cameraTried = false;
  }
  const nf = (n) => n.toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setState(patch) {
    const prev = { accent:state.accent, userName:state.userName, dailyGoal:state.dailyGoal };
    Object.assign(state, typeof patch === 'function' ? patch(state) : patch);
    if (prev.accent !== state.accent || prev.userName !== state.userName || prev.dailyGoal !== state.dailyGoal) {
      savePrefs(state);
    }
    render();
  }

  function go(page) {
    if (page === 'scan' && scanTimer) { clearTimeout(scanTimer); scanTimer = null; }
    const wasScan = state.page === 'scan';
    if (page === 'settings') {
      if (wasScan) stopCamera();
      setState({ page, settingsDraft:{ userName:state.userName, dailyGoal:state.dailyGoal, accent:state.accent } });
      return;
    }
    setState({ page, scanStage:'idle' });
    if (wasScan && page !== 'scan') stopCamera();
    if (!wasScan && page === 'scan') startCamera();
  }
  function setMode(key)     { setState({ activeMode: key }); }
  function changeServing(d) {
    const s = Math.min(3, Math.max(0.5, Math.round((state.servings + d) * 2) / 2));
    setState({ servings: s });
  }
  function onCapture() {
    if (state.scanStage === 'analyzing') return;
    setState({ scanStage:'analyzing' });
    scanTimer = setTimeout(() => {
      scanTimer = null;
      if (state.page !== 'scan') return;
      const f = FOODS[Math.floor(Math.random() * FOODS.length)];
      setState({ scanStage:'idle', resultFood:f, servings:1, page:'result' });
    }, 1900);
  }
  function saveResult() {
    const f = state.resultFood, s = state.servings;
    const kcal = Math.round(f.kcal * s);
    const meal = { meal:'เพิ่มล่าสุด', name:f.name, kcal, time:'เมื่อสักครู่', color:'#15a06a', tint:'#e3f4ea' };
    setState((st) => ({
      meals: [meal, ...st.meals],
      consumed:  st.consumed  + kcal,
      pConsumed: st.pConsumed + Math.round(f.protein * s),
      cConsumed: st.cConsumed + Math.round(f.carbs   * s),
      fConsumed: st.fConsumed + Math.round(f.fat     * s),
      page:'home',
      scanStage:'idle',
    }));
  }
  function setAccent(name) { setState({ accent:name }); }
  function onFilePicked(input) {
    if (!input.files || !input.files[0]) return;
    input.value = '';
    onCapture();
  }

  function updateDraft(field, val) {
    if (!state.settingsDraft) return;
    const d = { ...state.settingsDraft };
    if (field === 'userName')  d.userName  = String(val).slice(0, 30);
    if (field === 'dailyGoal') d.dailyGoal = Math.min(3500, Math.max(1200, parseInt(val, 10) || 0));
    if (field === 'accent' && ACCENTS[val]) d.accent = val;
    setState({ settingsDraft:d });
  }
  function saveSettings() {
    const d = state.settingsDraft;
    if (!d) return;
    const name = (d.userName || '').trim() || 'ผู้ใช้';
    setState({
      userName:  name,
      dailyGoal: d.dailyGoal,
      accent:    d.accent,
      settingsDraft:null,
      page:'home',
    });
  }
  function cancelSettings() { setState({ settingsDraft:null, page:'home' }); }
  function resetPrefs() {
    try { localStorage.removeItem(PREFS_KEY); } catch (e) {}
    setState({ userName:'พีรพล', dailyGoal:2000, accent:'green', settingsDraft:{ userName:'พีรพล', dailyGoal:2000, accent:'green' } });
  }

  window.__ns = { go, setMode, onCapture, changeServing, saveResult, setAccent, updateDraft, saveSettings, cancelSettings, resetPrefs, onFilePicked };

  // ---------- HOME ----------
  function renderHome(v) {
    const macrosHtml = v.macros.map((m) => `
      <div style="background:#faf8f1;border:1px solid #efe9da;border-radius:18px;padding:12px 11px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font:600 12px 'IBM Plex Sans Thai';color:#56655d;">${esc(m.label)}</span>
          <span style="width:8px;height:8px;border-radius:50%;background:${m.color};"></span>
        </div>
        <div style="font:800 16px 'Plus Jakarta Sans';color:#1b2722;margin-top:7px;">${m.v}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;">/${m.g}${m.unit}</span></div>
        <div style="height:5px;border-radius:4px;background:#eef0ea;margin-top:8px;overflow:hidden;">
          <div style="height:100%;border-radius:4px;background:${m.color};width:${m.pct}%;transition:width 1.1s ease;"></div>
        </div>
      </div>`).join('');

    const weekHtml = v.week.map((d) => `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end;">
        <div style="width:100%;max-width:24px;height:88px;border-radius:9px;background:#f0f2ec;display:flex;align-items:flex-end;overflow:hidden;">
          <div style="width:100%;border-radius:9px;height:${d.h};background:${d.fill};transition:height 1s cubic-bezier(.22,1,.36,1);box-shadow:${d.glow};"></div>
        </div>
        <span style="font:600 11px 'IBM Plex Sans Thai';color:${d.labelColor};">${esc(d.d)}</span>
      </div>`).join('');

    const mealsHtml = v.meals.map((meal) => `
      <div style="display:flex;align-items:center;gap:13px;background:#fff;border:1px solid #efe9da;border-radius:18px;padding:12px 14px;box-shadow:0 12px 28px -28px rgba(27,39,34,.4);">
        <div style="width:46px;height:46px;border-radius:14px;flex:none;background:${meal.tint};display:flex;align-items:center;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${meal.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"></path><path d="M12 11V4"></path><path d="M7 21V11"></path><path d="M17 21V11"></path><path d="M5 21h14"></path></svg>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font:600 14px 'IBM Plex Sans Thai';color:#1b2722;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(meal.name)}</div>
          <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">${esc(meal.meal)} · ${esc(meal.time)}</div>
        </div>
        <div style="font:800 15px 'Plus Jakarta Sans';color:#1b2722;">${meal.kcal}<span style="font:600 10px 'IBM Plex Sans Thai';color:#a4afa7;"> kcal</span></div>
      </div>`).join('');

    const bodyHtml = v.body.map((b) => `
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:15px;padding:11px 10px;">
        <div style="font:800 16px 'Plus Jakarta Sans';color:#fff;">${esc(b.v)}</div>
        <div style="font:500 10.5px 'IBM Plex Sans Thai';color:#aebfb4;margin-top:3px;">${esc(b.k)}</div>
      </div>`).join('');

    return `
    <section class="${v.screenAnim ? 'ns-screen' : ''}" style="height:100%;overflow-y:auto;padding:0 0 116px;">
      <header style="display:flex;align-items:center;justify-content:space-between;padding:26px 22px 10px;">
        <div>
          <div style="font:600 13px/1.2 'IBM Plex Sans Thai';color:#8a9890;letter-spacing:.2px;">${esc(v.greeting)}</div>
          <div style="font:800 23px/1.15 'Plus Jakarta Sans','IBM Plex Sans Thai';color:#1b2722;margin-top:4px;white-space:nowrap;">คุณ${esc(v.userName)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:11px;">
          <button title="ตั้งค่า" onclick="__ns.go('settings')" style="width:44px;height:44px;border-radius:15px;background:#fff;border:1px solid #ece7da;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px -8px rgba(27,39,34,.18);cursor:pointer;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>
          </button>
          <div style="width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 18px 'Plus Jakarta Sans';color:#fff;background:linear-gradient(140deg,var(--accent),#86d3ad);box-shadow:0 8px 18px -8px rgba(21,160,106,.7);">${esc(v.initial)}</div>
        </div>
      </header>

      <div style="margin:8px 18px 0;background:linear-gradient(165deg,#ffffff,#fbfaf5);border:1px solid #efe9da;border-radius:30px;padding:24px 22px 22px;box-shadow:0 24px 50px -34px rgba(27,39,34,.4);position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background:radial-gradient(420px 200px at 85% -20%,var(--accent-soft),transparent 70%);pointer-events:none;"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;position:relative;">
          <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;">แคลอรีวันนี้</div>
          <div style="display:flex;align-items:center;gap:6px;background:var(--accent-soft);color:var(--accent);font:700 11px 'IBM Plex Sans Thai';padding:6px 11px;border-radius:999px;"><span style="width:6px;height:6px;border-radius:50%;background:var(--accent);"></span>AI ปรับให้คุณ</div>
        </div>

        <div style="display:flex;align-items:center;gap:18px;margin-top:14px;position:relative;">
          <div style="position:relative;width:184px;height:184px;flex:none;">
            <svg width="184" height="184" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="84" fill="none" stroke="#eef0ea" stroke-width="15"></circle>
              <circle cx="100" cy="100" r="84" fill="none" stroke="var(--accent)" stroke-width="15" stroke-linecap="round" stroke-dasharray="528" style="stroke-dashoffset:${v.ringOffset};transition:stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1);transform:rotate(-90deg);transform-origin:center;"></circle>
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div style="font:800 40px/1 'Plus Jakarta Sans';color:#1b2722;letter-spacing:-1px;">${v.remaining}</div>
              <div style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:4px;">kcal เหลือ</div>
            </div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:14px;">
            <div>
              <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">เป้าหมาย</div>
              <div style="font:800 19px 'Plus Jakarta Sans';color:#1b2722;">${v.goalLabel} <span style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;">kcal</span></div>
            </div>
            <div>
              <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">กินไปแล้ว</div>
              <div style="font:800 19px 'Plus Jakarta Sans';color:var(--accent);">${v.consumedLabel} <span style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;">kcal</span></div>
            </div>
            <div style="height:8px;border-radius:6px;background:#eef0ea;overflow:hidden;">
              <div style="height:100%;border-radius:6px;background:linear-gradient(90deg,var(--accent),#7ed0a8);width:${v.consumedPct}%;transition:width 1.2s cubic-bezier(.22,1,.36,1);"></div>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:18px;position:relative;">
          ${macrosHtml}
        </div>
      </div>

      <div style="margin:16px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:26px;padding:20px 20px 16px;box-shadow:0 18px 40px -34px rgba(27,39,34,.35);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;">บันทึกสัปดาห์นี้</div>
          <div style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;">เฉลี่ย ${v.weekAvg} kcal</div>
        </div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:8px;height:118px;margin-top:16px;">
          ${weekHtml}
        </div>
      </div>

      <div style="margin:16px 18px 0;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0 4px 12px;">
          <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;">มื้อวันนี้</div>
          <button onclick="__ns.go('scan')" style="background:none;border:none;font:700 12px 'IBM Plex Sans Thai';color:var(--accent);cursor:pointer;">+ เพิ่มมื้อ</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${mealsHtml}
        </div>
      </div>

      <div style="margin:16px 18px 0;background:linear-gradient(150deg,#1f2b24,#2c3a30);border-radius:26px;padding:20px;color:#fff;box-shadow:0 22px 46px -30px rgba(27,39,34,.7);position:relative;overflow:hidden;">
        <div style="position:absolute;right:-30px;top:-30px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(126,208,168,.35),transparent 70%);"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;position:relative;">
          <div>
            <div style="font:600 12px 'IBM Plex Sans Thai';color:#aebfb4;">เป้าหมายของคุณ</div>
            <div style="font:800 19px 'Plus Jakarta Sans','IBM Plex Sans Thai';margin-top:3px;">ลดน้ำหนัก · -0.5 กก./สัปดาห์</div>
          </div>
          <div style="background:rgba(126,208,168,.18);color:#9fe3bf;font:700 11px 'IBM Plex Sans Thai';padding:7px 12px;border-radius:999px;">กำลังไปได้สวย</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px;position:relative;">
          ${bodyHtml}
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;font:500 11.5px 'IBM Plex Sans Thai';color:#9fe3bf;position:relative;">
          <span style="width:6px;height:6px;border-radius:50%;background:#9fe3bf;"></span>AI คำนวณ TDEE จากร่างกายของคุณแล้วตั้งเป้าให้อัตโนมัติ
        </div>
      </div>
    </section>`;
  }

  // ---------- SCAN ----------
  function renderScan(v) {
    const modesHtml = v.modes.map((m) => `
      <button class="ns-chip" onclick="__ns.setMode('${m.key}')" style="white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 16px;border-radius:999px;border:1px solid ${m.border};background:${m.bg};color:${m.fg};font:600 12.5px 'IBM Plex Sans Thai';cursor:pointer;transition:all .2s;">
        <span style="width:7px;height:7px;border-radius:50%;background:${m.dot};"></span>${esc(m.label)}
      </button>`).join('');

    const scanningOverlay = v.scanning ? `
      <div style="position:absolute;inset:0;background:rgba(17,24,20,.82);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;">
        <div style="position:relative;width:74px;height:74px;">
          <div style="position:absolute;inset:0;border-radius:50%;border:3px solid rgba(159,227,191,.25);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:3px solid transparent;border-top-color:#9fe3bf;animation:ns-spin .9s linear infinite;"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;background:var(--accent);opacity:.5;animation:ns-pulseRing 1.6s ease-out infinite;"></div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:800 13px 'Plus Jakarta Sans';color:#9fe3bf;">AI</div>
        </div>
        <div style="text-align:center;">
          <div style="font:700 15px 'IBM Plex Sans Thai';color:#fff;">AI กำลังวิเคราะห์โภชนาการ</div>
          <div style="display:flex;gap:5px;justify-content:center;margin-top:9px;">
            <span style="width:7px;height:7px;border-radius:50%;background:#9fe3bf;animation:ns-dots 1.3s infinite;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:#9fe3bf;animation:ns-dots 1.3s .2s infinite;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:#9fe3bf;animation:ns-dots 1.3s .4s infinite;"></span>
          </div>
        </div>
      </div>` : '';

    return `
    <section class="${v.screenAnim ? 'ns-screen' : ''}" style="height:100%;background:linear-gradient(180deg,#1b2420,#222e27);overflow:hidden;position:relative;display:flex;flex-direction:column;padding-bottom:108px;">
      <header style="display:flex;align-items:center;justify-content:space-between;padding:24px 22px 6px;position:relative;z-index:3;">
        <div style="display:flex;align-items:center;gap:9px;">
          <div style="width:34px;height:34px;border-radius:11px;background:var(--accent);display:flex;align-items:center;justify-content:center;font:800 13px 'Plus Jakarta Sans';color:#fff;">N</div>
          <div style="font:800 16px 'Plus Jakarta Sans','IBM Plex Sans Thai';color:#fff;">NutriScan <span style="color:#9fe3bf;">AI</span></div>
        </div>
        <button onclick="__ns.go('home')" style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,.1);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
        </button>
      </header>

      <div style="text-align:center;padding:6px 24px 0;position:relative;z-index:3;">
        <div style="font:700 18px 'IBM Plex Sans Thai';color:#fff;">${esc(v.modeTitle)}</div>
        <div style="font:500 12.5px 'IBM Plex Sans Thai';color:#9aa8a0;margin-top:4px;">${esc(v.modeHint)}</div>
      </div>

      <div style="margin:18px 26px 0;flex:1;min-height:84px;border-radius:28px;position:relative;overflow:hidden;background:repeating-linear-gradient(45deg,#27332c,#27332c 12px,#222e27 12px,#222e27 24px);">
        <video id="ns-cam" autoplay muted playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000;opacity:${v.camLive ? 1 : 0};transition:opacity .3s;"></video>
        <div style="position:absolute;inset:0;display:${v.camLive ? 'none' : 'flex'};align-items:center;justify-content:center;flex-direction:column;gap:8px;text-align:center;padding:0 24px;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#56655d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z"></path><circle cx="12" cy="13" r="3.5"></circle></svg>
          <span style="font:600 11px 'Plus Jakarta Sans';color:#56655d;letter-spacing:.5px;">${v.camHint}</span>
        </div>
        <div style="position:absolute;left:18px;top:18px;width:34px;height:34px;border-left:3px solid #9fe3bf;border-top:3px solid #9fe3bf;border-radius:6px 0 0 0;"></div>
        <div style="position:absolute;right:18px;top:18px;width:34px;height:34px;border-right:3px solid #9fe3bf;border-top:3px solid #9fe3bf;border-radius:0 6px 0 0;"></div>
        <div style="position:absolute;left:18px;bottom:18px;width:34px;height:34px;border-left:3px solid #9fe3bf;border-bottom:3px solid #9fe3bf;border-radius:0 0 0 6px;"></div>
        <div style="position:absolute;right:18px;bottom:18px;width:34px;height:34px;border-right:3px solid #9fe3bf;border-bottom:3px solid #9fe3bf;border-radius:0 0 6px 0;"></div>
        <div style="position:absolute;left:8%;right:8%;top:6%;height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,#9fe3bf,transparent);box-shadow:0 0 20px 5px rgba(159,227,191,.55);animation:ns-scanline 2.4s ease-in-out infinite;"></div>
        ${scanningOverlay}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:16px 26px 0;position:relative;z-index:3;flex:none;">
        ${modesHtml}
      </div>

      <div style="display:flex;align-items:center;justify-content:center;gap:30px;z-index:3;margin:18px 26px 0;flex:none;">
        <input id="ns-file-input" type="file" accept="image/*" style="display:none;" onchange="__ns.onFilePicked(this)">
        <button title="เลือกรูปจากแกลเลอรี" onclick="document.getElementById('ns-file-input').click()" style="width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cdd6cf" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8.5" cy="8.5" r="1.6"></circle><path d="m21 15-5-5L5 21"></path></svg>
        </button>
        <button onclick="__ns.onCapture()" style="width:72px;height:72px;border-radius:50%;border:5px solid rgba(255,255,255,.22);background:var(--accent);box-shadow:0 14px 34px -12px rgba(21,160,106,.9);cursor:pointer;display:flex;align-items:center;justify-content:center;">
          <span style="width:52px;height:52px;border-radius:50%;border:2px solid rgba(255,255,255,.6);"></span>
        </button>
        <button title="โหมดเล็งเต็มจอ" onclick="__ns.onCapture()" style="width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cdd6cf" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path></svg>
        </button>
      </div>
    </section>`;
  }

  // ---------- RESULT ----------
  function renderResult(v) {
    const nutHtml = v.nutrients.map((n) => `
      <div style="padding:13px 0;border-bottom:1px solid #f1ede1;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="width:10px;height:10px;border-radius:3px;background:${n.color};"></span>
            <span style="font:600 13.5px 'IBM Plex Sans Thai';color:#1b2722;">${esc(n.label)}</span>
          </div>
          <div style="font:800 15px 'Plus Jakarta Sans';color:#1b2722;">${n.value}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;"> ${esc(n.unit)}</span></div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:9px;">
          <div style="flex:1;height:6px;border-radius:5px;background:#f0f2ec;overflow:hidden;">
            <div style="height:100%;border-radius:5px;background:${n.color};width:${n.pct}%;transition:width 1s ease;"></div>
          </div>
          <span style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;white-space:nowrap;">${n.pct}% ต่อวัน</span>
        </div>
      </div>`).join('');

    return `
    <section class="${v.screenAnim ? 'ns-screen' : ''}" style="height:100%;overflow-y:auto;padding:0 0 120px;">
      <header style="display:flex;align-items:center;justify-content:space-between;padding:24px 22px 8px;">
        <button onclick="__ns.go('scan')" style="width:42px;height:42px;border-radius:14px;background:#fff;border:1px solid #ece7da;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 16px -10px rgba(27,39,34,.3);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
        </button>
        <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;white-space:nowrap;">ผลการวิเคราะห์</div>
        <div style="display:flex;align-items:center;gap:6px;background:var(--accent-soft);color:var(--accent);font:800 11px 'Plus Jakarta Sans';padding:8px 11px;border-radius:999px;white-space:nowrap;">AI ${v.confidence}%</div>
      </header>

      <div style="margin:8px 18px 0;border-radius:28px;overflow:hidden;background:#fff;border:1px solid #efe9da;box-shadow:0 24px 50px -34px rgba(27,39,34,.45);">
        <div style="height:158px;position:relative;background:repeating-linear-gradient(45deg,#eee7d6,#eee7d6 13px,#f6f1e4 13px,#f6f1e4 26px);display:flex;align-items:center;justify-content:center;">
          <span style="font:600 11px 'Plus Jakarta Sans';color:#b3aa93;letter-spacing:.5px;">FOOD PHOTO</span>
          <div style="position:absolute;left:14px;top:14px;display:flex;align-items:center;gap:6px;background:rgba(27,39,34,.82);color:#9fe3bf;font:600 11px 'IBM Plex Sans Thai';padding:7px 11px;border-radius:999px;backdrop-filter:blur(4px);"><span style="width:6px;height:6px;border-radius:50%;background:#9fe3bf;"></span>ตรวจพบแล้ว</div>
        </div>
        <div style="padding:16px 18px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
            <div>
              <div style="font:700 19px 'IBM Plex Sans Thai';color:#1b2722;">${esc(v.food.name)}</div>
              <div style="display:inline-block;margin-top:8px;font:600 11px 'IBM Plex Sans Thai';color:#8a9890;background:#f4f1ea;padding:5px 11px;border-radius:999px;">${esc(v.food.tag)}</div>
            </div>
          </div>
          <div style="margin-top:16px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(150deg,var(--accent-soft),#fbfaf5);border-radius:20px;padding:16px 18px;">
            <div>
              <div style="font:600 12px 'IBM Plex Sans Thai';color:#56655d;">พลังงานรวม</div>
              <div style="font:800 38px/1 'Plus Jakarta Sans';color:#1b2722;letter-spacing:-1px;margin-top:4px;">${v.resultKcal} <span style="font:700 16px 'Plus Jakarta Sans';color:var(--accent);">kcal</span></div>
            </div>
            <div style="text-align:right;">
              <div style="font:600 11px 'IBM Plex Sans Thai';color:#56655d;">ของเป้าหมาย</div>
              <div style="font:800 24px 'Plus Jakarta Sans';color:var(--accent);">${v.goalSharePct}%</div>
            </div>
          </div>
        </div>
      </div>

      <div style="margin:14px 18px 0;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #efe9da;border-radius:20px;padding:14px 16px;">
        <div>
          <div style="font:600 14px 'IBM Plex Sans Thai';color:#1b2722;">ปริมาณที่ทาน</div>
          <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">หน่วยบริโภค</div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;">
          <button onclick="__ns.changeServing(-0.5)" style="width:38px;height:38px;border-radius:12px;border:1px solid #e2ddcf;background:#faf8f1;font:700 20px 'Plus Jakarta Sans';color:#1b2722;cursor:pointer;line-height:1;">−</button>
          <div style="font:800 18px 'Plus Jakarta Sans';color:#1b2722;min-width:34px;text-align:center;">${v.servingLabel}</div>
          <button onclick="__ns.changeServing(0.5)" style="width:38px;height:38px;border-radius:12px;border:none;background:var(--accent);font:700 20px 'Plus Jakarta Sans';color:#fff;cursor:pointer;line-height:1;">+</button>
        </div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:18px;box-shadow:0 18px 40px -36px rgba(27,39,34,.4);">
        <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:6px;">สารอาหารต่อมื้อ</div>
        ${nutHtml}
        <div style="display:flex;align-items:flex-start;gap:8px;margin-top:13px;font:500 11.5px/1.5 'IBM Plex Sans Thai';color:var(--accent);">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--accent);margin-top:6px;flex:none;"></span><span>คำนวณโดย AI · ค่าโดยประมาณ ควรตรวจสอบกับฉลากของผลิตภัณฑ์อีกครั้ง</span>
        </div>
      </div>

      <div style="margin:18px 18px 0;display:flex;gap:11px;">
        <button onclick="__ns.go('scan')" style="flex:none;width:54px;height:54px;border-radius:17px;border:1px solid #e2ddcf;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path><path d="M3 21v-5h5"></path></svg>
        </button>
        <button onclick="__ns.saveResult()" style="flex:1;height:54px;border-radius:17px;border:none;background:var(--accent);color:#fff;font:700 15px 'IBM Plex Sans Thai';cursor:pointer;box-shadow:0 14px 30px -12px rgba(21,160,106,.8);display:flex;align-items:center;justify-content:center;gap:8px;">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>บันทึกลงไดอารี่
        </button>
      </div>
    </section>`;
  }

  // ---------- SETTINGS ----------
  function renderSettings(v) {
    const d = v.draft;
    const swatchHtml = ['green','blue','coral'].map((name) => {
      const [c, cs] = ACCENTS[name];
      const on = d.accent === name;
      const label = { green:'เขียวสด', blue:'ฟ้าใส', coral:'คอรัล' }[name];
      return `
        <button onclick="__ns.updateDraft('accent','${name}')" style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:18px;border:2px solid ${on ? c : '#efe9da'};background:${on ? cs : '#fff'};cursor:pointer;transition:all .2s;">
          <span style="width:36px;height:36px;border-radius:50%;background:linear-gradient(140deg,${c},#86d3ad00 140%),${c};box-shadow:0 6px 14px -6px ${c};display:flex;align-items:center;justify-content:center;">
            ${on ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>' : ''}
          </span>
          <span style="font:700 12px 'IBM Plex Sans Thai';color:${on ? c : '#1b2722'};">${label}</span>
        </button>`;
    }).join('');

    return `
    <section class="${v.screenAnim ? 'ns-screen' : ''}" style="height:100%;overflow-y:auto;padding:0 0 120px;">
      <header style="display:flex;align-items:center;justify-content:space-between;padding:24px 22px 8px;">
        <button onclick="__ns.cancelSettings()" style="width:42px;height:42px;border-radius:14px;background:#fff;border:1px solid #ece7da;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 16px -10px rgba(27,39,34,.3);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
        </button>
        <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;">ตั้งค่า</div>
        <div style="width:42px;"></div>
      </header>

      <div style="margin:8px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:20px;box-shadow:0 18px 40px -36px rgba(27,39,34,.4);">
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:14px;">ข้อมูลผู้ใช้</div>
        <label style="display:block;font:600 12px 'IBM Plex Sans Thai';color:#56655d;margin-bottom:6px;">ชื่อที่แสดง</label>
        <input id="ns-input-name" type="text" value="${esc(d.userName)}" maxlength="30" oninput="__ns.updateDraft('userName', this.value)" style="width:100%;padding:13px 14px;border-radius:14px;border:1px solid #e2ddcf;background:#faf8f1;font:600 14px 'IBM Plex Sans Thai';color:#1b2722;outline:none;">

        <label style="display:block;font:600 12px 'IBM Plex Sans Thai';color:#56655d;margin:18px 0 6px;">เป้าหมายแคลอรีต่อวัน (1200–3500)</label>
        <div style="display:flex;align-items:center;gap:12px;">
          <input id="ns-input-goal" type="number" min="1200" max="3500" step="50" value="${d.dailyGoal}" oninput="__ns.updateDraft('dailyGoal', this.value)" style="flex:none;width:110px;padding:13px 14px;border-radius:14px;border:1px solid #e2ddcf;background:#faf8f1;font:700 16px 'Plus Jakarta Sans';color:#1b2722;outline:none;text-align:center;">
          <input type="range" min="1200" max="3500" step="50" value="${d.dailyGoal}" oninput="__ns.updateDraft('dailyGoal', this.value)" style="flex:1;accent-color:${ACCENTS[d.accent][0]};">
        </div>
        <div style="font:500 11.5px 'IBM Plex Sans Thai';color:#8a9890;margin-top:6px;">AI คำนวณ TDEE ของคุณราว 2,000 kcal</div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:20px;box-shadow:0 18px 40px -36px rgba(27,39,34,.4);">
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:14px;">สีธีมของแอป</div>
        <div style="display:flex;gap:10px;">${swatchHtml}</div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div>
          <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">รีเซ็ตเป็นค่าเริ่มต้น</div>
          <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:3px;">ล้างค่าที่บันทึกใน localStorage</div>
        </div>
        <button onclick="__ns.resetPrefs()" style="flex:none;padding:10px 16px;border-radius:12px;border:1px solid #e2ddcf;background:#faf8f1;font:700 12.5px 'IBM Plex Sans Thai';color:#1b2722;cursor:pointer;">รีเซ็ต</button>
      </div>

      <div style="margin:20px 18px 0;display:flex;gap:11px;">
        <button onclick="__ns.cancelSettings()" style="flex:1;height:54px;border-radius:17px;border:1px solid #e2ddcf;background:#fff;font:700 14px 'IBM Plex Sans Thai';color:#1b2722;cursor:pointer;">ยกเลิก</button>
        <button onclick="__ns.saveSettings()" style="flex:2;height:54px;border-radius:17px;border:none;background:var(--accent);color:#fff;font:700 15px 'IBM Plex Sans Thai';cursor:pointer;box-shadow:0 14px 30px -12px rgba(21,160,106,.8);display:flex;align-items:center;justify-content:center;gap:8px;">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>บันทึก
        </button>
      </div>
    </section>`;
  }

  // ---------- BOTTOM NAV ----------
  function renderNav(v) {
    return `
    <nav style="position:absolute;left:0;right:0;bottom:0;background:rgba(255,255,255,.86);backdrop-filter:blur(18px);border-top:1px solid rgba(27,39,34,.06);display:flex;align-items:center;justify-content:space-around;padding:14px 26px max(14px,env(safe-area-inset-bottom));z-index:20;">
      <button onclick="__ns.go('home')" style="display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:none;cursor:pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${v.navHomeColor}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"></path></svg>
        <span style="font:600 10.5px 'IBM Plex Sans Thai';color:${v.navHomeColor};">หน้าหลัก</span>
      </button>
      <button onclick="__ns.go('scan')" style="display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;cursor:pointer;margin-top:-26px;">
        <span style="width:60px;height:60px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 28px -8px rgba(21,160,106,.75);border:4px solid #f4f1ea;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path><circle cx="12" cy="12" r="3.4"></circle></svg>
        </span>
        <span style="font:700 10.5px 'IBM Plex Sans Thai';color:var(--accent);">สแกน</span>
      </button>
      <button onclick="__ns.go('result')" style="display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:none;cursor:pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${v.navResultColor}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20V10M12 20V4M18 20v-6"></path></svg>
        <span style="font:600 10.5px 'IBM Plex Sans Thai';color:${v.navResultColor};">ผลลัพธ์</span>
      </button>
    </nav>`;
  }

  // ---------- DERIVED VIEW ----------
  function compute() {
    const [accent, accentSoft] = ACCENTS[state.accent] || ACCENTS.green;
    const goal = state.dailyGoal;
    const userName = state.userName;
    const consumed = state.consumed;
    const remaining = Math.max(0, goal - consumed);
    const consumedPct = Math.min(100, Math.round(consumed / goal * 100));
    const C = 2 * Math.PI * 84;
    const ringOffset = C * (1 - Math.min(1, consumed / goal));

    const h = new Date().getHours();
    const greeting = h < 11 ? 'สวัสดีตอนเช้า ☀' : h < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';

    const macros = [
      { label:'โปรตีน', color:'#4c8dff', v:state.pConsumed, g:120, unit:'g' },
      { label:'คาร์บ',  color:'#f5a524', v:state.cConsumed, g:250, unit:'g' },
      { label:'ไขมัน',  color:'#ff8a5b', v:state.fConsumed, g:65,  unit:'g' },
    ].map((m) => ({ ...m, pct: Math.min(100, Math.round(m.v / m.g * 100)) }));

    const wd = ['อา','จ','อ','พ','พฤ','ศ'];
    const wbase = [1620, 1980, 1740, 2120, 1850, 1760];
    const scaleMax = Math.max(goal, 2300);
    const week = wbase.map((v,i) => ({ d:wd[i], val:v })).concat([{ d:'ส', val:consumed }]).map((w,i) => {
      const today = i === 6;
      return {
        d: w.d,
        h: Math.round(w.val / scaleMax * 100) + '%',
        fill: today ? accent : '#d3ddd5',
        glow: today ? '0 6px 14px -6px ' + accent : 'none',
        labelColor: today ? accent : '#9aa8a0',
      };
    });
    const weekAvg = nf(Math.round((wbase.reduce((a,b) => a+b, 0) + consumed) / 7));

    const body = [
      { v:'2,000', k:'TDEE kcal' },
      { v:'62',    k:'น้ำหนัก กก.' },
      { v:'168',   k:'ส่วนสูง ซม.' },
      { v:'22.0',  k:'BMI' },
    ];

    const modeMeta = {
      food:    { label:'ถ่ายอาหาร', title:'ถ่ายรูปอาหาร',  hint:'จัดให้อาหารอยู่กลางกรอบ แล้วกดถ่าย' },
      barcode: { label:'บาร์โค้ด',   title:'สแกนบาร์โค้ด', hint:'เล็งบาร์โค้ดบนบรรจุภัณฑ์ให้อยู่ในกรอบ' },
    };
    if (!modeMeta[state.activeMode]) state.activeMode = 'food';
    const modes = ['food','barcode'].map((k) => {
      const on = state.activeMode === k;
      return {
        key:k, label:modeMeta[k].label,
        bg:     on ? accent : 'rgba(255,255,255,.07)',
        fg:     on ? '#fff'  : '#cdd6cf',
        border: on ? accent : 'rgba(255,255,255,.14)',
        dot:    on ? '#fff'  : '#7e8c84',
      };
    });
    const mm = modeMeta[state.activeMode] || modeMeta.food;

    const f = state.resultFood, s = state.servings;
    const resultKcal = Math.round(f.kcal * s);
    const nutrients = [
      { label:'โปรตีน',         unit:'g',  color:'#4c8dff', raw:f.protein*s, rec:120  },
      { label:'คาร์โบไฮเดรต', unit:'g',  color:'#f5a524', raw:f.carbs*s,   rec:250  },
      { label:'ไขมัน',          unit:'g',  color:'#ff8a5b', raw:f.fat*s,     rec:65   },
      { label:'น้ำตาล',         unit:'g',  color:'#ec5a96', raw:f.sugar*s,   rec:50   },
      { label:'โซเดียม',        unit:'mg', color:'#38bdf8', raw:f.sodium*s,  rec:2300 },
    ].map((n) => ({ label:n.label, unit:n.unit, color:n.color, value:nf(Math.round(n.raw)), pct:Math.min(100, Math.round(n.raw / n.rec * 100)) }));

    const servingLabel = (s % 1 === 0) ? String(s) : String(s);
    const goalSharePct = Math.round(resultKcal / goal * 100);

    const accentOrder = ['green','blue','coral'];
    const idx = accentOrder.indexOf(state.accent);
    const nextAccent = accentOrder[(idx + 1) % accentOrder.length];

    const camLive = !!cameraStream;
    const camHint = camLive ? 'CAMERA FEED'
      : cameraTried ? 'กล้องไม่พร้อม · เปิดใน Safari หรืออัปโหลดรูป'
      : 'CAMERA FEED';

    return {
      accent, accentSoft, userName, initial:userName.charAt(0), greeting, nextAccent,
      remaining:nf(remaining), goalLabel:nf(goal), consumedLabel:nf(consumed), consumedPct, ringOffset,
      macros, week, weekAvg, body, meals:state.meals,
      modes, modeTitle:mm.title, modeHint:mm.hint,
      scanning:state.scanStage === 'analyzing',
      camLive, camHint,
      food:f, resultKcal:nf(resultKcal), confidence:f.confidence, goalSharePct,
      nutrients, servingLabel,
      draft: state.settingsDraft || { userName, dailyGoal:goal, accent:state.accent },
      navHomeColor:   state.page === 'home'   ? accent : '#9aa8a0',
      navResultColor: state.page === 'result' ? accent : '#9aa8a0',
    };
  }

  function render() {
    const v = compute();
    v.screenAnim = (lastPage !== state.page);
    lastPage = state.page;
    root.style.setProperty('--accent', v.accent);
    root.style.setProperty('--accent-soft', v.accentSoft);

    const ae = document.activeElement;
    const focusId = ae && ae.id && root.contains(ae) ? ae.id : null;
    const selStart = focusId && 'selectionStart' in ae ? ae.selectionStart : null;
    const selEnd   = focusId && 'selectionEnd'   in ae ? ae.selectionEnd   : null;

    let screen = '';
    if (state.page === 'home')     screen = renderHome(v);
    if (state.page === 'scan')     screen = renderScan(v);
    if (state.page === 'result')   screen = renderResult(v);
    if (state.page === 'settings') screen = renderSettings(v);
    const showNav = state.page !== 'settings';
    root.innerHTML = screen + (showNav ? renderNav(v) : '');

    if (focusId) {
      const next = document.getElementById(focusId);
      if (next) {
        next.focus({ preventScroll:true });
        try { if (selStart != null) next.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }

    if (state.page === 'scan' && cameraStream) {
      const vid = document.getElementById('ns-cam');
      if (vid && vid.srcObject !== cameraStream) {
        vid.srcObject = cameraStream;
        vid.play().catch(() => {});
      }
    }
  }

  render();
})();
