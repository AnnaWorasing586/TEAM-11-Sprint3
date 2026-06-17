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
  const DAY_KEY = 'nutriscan.day.v1';
  const STATS_KEY = 'nutriscan.stats.v1';
  const BODY_GOALS = ['ลดน้ำหนัก', 'รักษาน้ำหนัก', 'เพิ่มกล้ามเนื้อ'];
  const WATER_GOAL = 2000;

  const today = () => new Date().toISOString().slice(0, 10);
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      const out = {};
      if (typeof p.userName === 'string' && p.userName.trim()) out.userName = p.userName.trim().slice(0, 30);
      if (Number.isFinite(p.dailyGoal)) out.dailyGoal = Math.min(3500, Math.max(0, Math.round(p.dailyGoal)));
      if (ACCENTS[p.accent]) out.accent = p.accent;
      if (Number.isFinite(p.weight)) out.weight = Math.min(250, Math.max(0, p.weight));
      if (Number.isFinite(p.height)) out.height = Math.min(230, Math.max(0, p.height));
      if (BODY_GOALS.includes(p.bodyGoal)) out.bodyGoal = p.bodyGoal;
      if (typeof p.darkMode === 'boolean') out.darkMode = p.darkMode;
      return out;
    } catch (e) { return null; }
  }
  function savePrefs(s) {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        userName:  s.userName,
        dailyGoal: s.dailyGoal,
        accent:    s.accent,
        weight:    s.weight,
        height:    s.height,
        bodyGoal:  s.bodyGoal,
        darkMode:  s.darkMode,
      }));
    } catch (e) {}
  }

  function loadDay() {
    try {
      const raw = localStorage.getItem(DAY_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (d.date !== today()) return null;
      return d;
    } catch (e) { return null; }
  }
  function saveDay(s) {
    try {
      localStorage.setItem(DAY_KEY, JSON.stringify({
        date: today(),
        water: s.water || 0,
        consumed: s.consumed || 0,
        pConsumed: s.pConsumed || 0,
        cConsumed: s.cConsumed || 0,
        fConsumed: s.fConsumed || 0,
        meals: s.meals || [],
      }));
    } catch (e) {}
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { streak: 0, lastLogDate: null, badges: {}, totalScans: 0, history: [] };
      return JSON.parse(raw);
    } catch (e) { return { streak: 0, lastLogDate: null, badges: {}, totalScans: 0, history: [] }; }
  }
  function saveStats(stats) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (e) {}
  }

  const PREFS = loadPrefs() || {};
  const DAY = loadDay() || {};
  const STATS = loadStats();

  // ============================================
  // Supabase client (optional — works locally if not configured)
  // ============================================
  const SB_URL = window.NS_SUPABASE_URL || '';
  const SB_KEY = window.NS_SUPABASE_KEY || '';
  let supabase = null;
  function initSupabase() {
    if (supabase) return supabase;
    if (!SB_URL || !SB_KEY) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    try {
      supabase = window.supabase.createClient(SB_URL, SB_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, storage: localStorage },
      });
      return supabase;
    } catch (e) { return null; }
  }

  const state = {
    page: 'home',
    scanStage: 'idle',
    activeMode: 'food',
    servings: 1,
    resultFood: FOODS[0],
    resultImage: null,
    consumed: DAY.consumed || 0,
    pConsumed: DAY.pConsumed || 0,
    cConsumed: DAY.cConsumed || 0,
    fConsumed: DAY.fConsumed || 0,
    water: DAY.water || 0,
    accent: PREFS.accent ?? 'green',
    userName: PREFS.userName ?? 'ผู้ใช้',
    dailyGoal: PREFS.dailyGoal ?? 0,
    weight: PREFS.weight ?? 0,
    height: PREFS.height ?? 0,
    bodyGoal: PREFS.bodyGoal ?? '',
    darkMode: PREFS.darkMode ?? false,
    settingsDraft: null,
    searchOpen: false,
    searchQuery: '',
    streak: STATS.streak || 0,
    lastLogDate: STATS.lastLogDate || null,
    badges: STATS.badges || {},
    totalScans: STATS.totalScans || 0,
    history: STATS.history || [],
    toast: null,
    meals: DAY.meals || [],
    user: null,
    syncing: false,
    recommend: null,
    recommendBusy: false,
    weeklySummary: null,
    summaryBusy: false,
    editOpen: false,
    editFood: null,
    authOverlayOpen: false,
  };

  let scanTimer = null;
  let lastPage = null;
  let cameraStream = null;
  let cameraTried = false;
  const root = document.getElementById('app-root');
  const API_URL = (window.NS_API_URL || '').replace(/\/$/, '');

  // ============================================
  // Image cache (saves AI quota for repeat scans)
  // ============================================
  const IMG_CACHE_KEY = 'nutriscan.imgcache.v1';
  const imgCache = (() => {
    try { return JSON.parse(sessionStorage.getItem(IMG_CACHE_KEY) || '{}'); } catch (e) { return {}; }
  })();
  async function hashBlob(blob) {
    try {
      const buf = await blob.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
    } catch (e) { return null; }
  }
  function cacheGet(hash) { return hash ? imgCache[hash] : null; }
  function cacheSet(hash, food) {
    if (!hash) return;
    imgCache[hash] = food;
    try { sessionStorage.setItem(IMG_CACHE_KEY, JSON.stringify(imgCache)); } catch (e) {}
  }

  function captureVideoFrame() {
    const video = document.getElementById('ns-cam');
    if (!video || !video.videoWidth) return Promise.resolve(null);
    const canvas = document.createElement('canvas');
    const maxDim = 1280;
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
  }

  async function callRealAPI(blobOrFile, mode) {
    if (!API_URL) return null;
    const endpoint = mode === 'label' ? '/api/scan/label' : '/api/scan/photo';
    const fd = new FormData();
    fd.append('image', blobOrFile, 'capture.jpg');
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 30000);
      const r = await fetch(API_URL + endpoint, { method:'POST', body:fd, signal:ctrl.signal });
      clearTimeout(t);
      if (!r.ok) return null;
      const data = await r.json();
      if (!data || typeof data.kcal !== 'number') return null;
      return { ...data, confidence: data.confidence || 80 };
    } catch (e) { return null; }
  }

  async function callRecommend() {
    if (!API_URL) return null;
    const goal = state.dailyGoal || 0;
    const r_kcal = Math.max(0, goal - state.consumed);
    const r_prot = Math.max(0, 120 - state.pConsumed);
    const r_carb = Math.max(0, 250 - state.cConsumed);
    const r_fat  = Math.max(0, 65  - state.fConsumed);
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 20000);
      const r = await fetch(API_URL + '/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remaining_kcal: r_kcal, remaining_protein: r_prot,
          remaining_carbs: r_carb, remaining_fat: r_fat,
          hour: new Date().getHours(),
        }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!r.ok) return null;
      return await r.json();
    } catch (e) { return null; }
  }

  async function callWeeklySummary() {
    if (!API_URL) return null;
    const goal = state.dailyGoal || 0;
    const history = state.history || [];
    const totalKcal = history.reduce((a, h) => a + (h.kcal || 0), 0);
    const days = history.filter((h) => h.kcal > 0).length;
    const avg = days > 0 ? Math.round(totalKcal / days) : 0;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      const r = await fetch(API_URL + '/api/weekly-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history, avg_kcal: avg, goal_kcal: goal, streak: state.streak || 0,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!r.ok) return null;
      return await r.json();
    } catch (e) { return null; }
  }

  async function callBarcodeAPI(barcode) {
    if (!API_URL) return null;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const r = await fetch(API_URL + '/api/scan/barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!r.ok) return null;
      const data = await r.json();
      if (!data || typeof data.kcal !== 'number') return null;
      return { ...data, confidence: data.confidence || 80 };
    } catch (e) { return null; }
  }

  async function decodeBarcodeFromVideo() {
    const video = document.getElementById('ns-cam');
    if (!video || !video.videoWidth) return null;
    const Z = window.ZXingBrowser;
    if (!Z || !Z.BrowserMultiFormatReader) return null;
    try {
      const reader = new Z.BrowserMultiFormatReader();
      const result = await reader.decodeOnceFromVideoElement(video);
      return result ? result.getText() : null;
    } catch (e) { return null; }
  }

  function pickMock() {
    return FOODS[Math.floor(Math.random() * FOODS.length)];
  }

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

  const PREF_KEYS = ['accent','userName','dailyGoal','weight','height','bodyGoal','darkMode'];
  const DAY_KEYS  = ['water','consumed','pConsumed','cConsumed','fConsumed','meals'];
  const STAT_KEYS = ['streak','lastLogDate','badges','totalScans','history'];

  function setState(patch) {
    const prev = {};
    PREF_KEYS.concat(DAY_KEYS, STAT_KEYS).forEach((k) => { prev[k] = state[k]; });
    Object.assign(state, typeof patch === 'function' ? patch(state) : patch);
    const prefsChanged = PREF_KEYS.some((k) => prev[k] !== state[k]);
    const statsChanged = STAT_KEYS.some((k) => prev[k] !== state[k]);
    if (prefsChanged) savePrefs(state);
    if (DAY_KEYS.some((k) => prev[k] !== state[k])) saveDay(state);
    if (statsChanged) {
      saveStats({
        streak: state.streak, lastLogDate: state.lastLogDate,
        badges: state.badges, totalScans: state.totalScans, history: state.history,
      });
    }
    if ((prefsChanged || statsChanged) && state.user) schedulePush();
    render();
  }

  function showToast(msg, kind) {
    setState({ toast: { msg, kind: kind || 'info', t: Date.now() } });
    setTimeout(() => {
      if (state.toast && Date.now() - state.toast.t >= 2500) setState({ toast: null });
    }, 2800);
  }

  function addWater(ml) {
    const w = Math.max(0, Math.min(5000, (state.water || 0) + ml));
    setState({ water: w });
    if (state.user) pushWaterToCloud(ml);
  }
  function resetWater() { setState({ water: 0 }); }

  const BADGE_DEFS = [
    { id: 'first_scan',  name: 'สแกนครั้งแรก',       icon: '🎯', check: (s) => s.totalScans >= 1 },
    { id: 'ten_scans',   name: 'สแกน 10 ครั้ง',         icon: '📸', check: (s) => s.totalScans >= 10 },
    { id: 'streak_3',    name: 'บันทึก 3 วันติด',       icon: '🔥', check: (s) => s.streak >= 3 },
    { id: 'streak_7',    name: 'บันทึก 7 วันติด',       icon: '⚡', check: (s) => s.streak >= 7 },
    { id: 'streak_30',   name: 'บันทึก 30 วันติด',      icon: '👑', check: (s) => s.streak >= 30 },
    { id: 'water_goal',  name: 'ดื่มน้ำครบ 2L',         icon: '💧', check: (s) => s.water >= WATER_GOAL },
    { id: 'three_meals', name: 'บันทึก 3 มื้อในวัน',   icon: '🍽️', check: (s) => s.meals.length >= 3 },
  ];

  function checkBadges() {
    const earned = { ...state.badges };
    let newlyEarned = null;
    BADGE_DEFS.forEach((b) => {
      if (!earned[b.id] && b.check(state)) {
        earned[b.id] = today();
        if (!newlyEarned) newlyEarned = b;
      }
    });
    if (newlyEarned) {
      setState({ badges: earned });
      showToast(`ปลดล็อค: ${newlyEarned.icon} ${newlyEarned.name}`, 'success');
    }
  }

  function updateStreakOnLog() {
    const t = today();
    if (state.lastLogDate === t) return;
    let newStreak = 1;
    if (state.lastLogDate) {
      const gap = daysBetween(state.lastLogDate, t);
      if (gap === 1) newStreak = (state.streak || 0) + 1;
      else if (gap === 0) newStreak = state.streak || 1;
      else newStreak = 1;
    }
    setState({ streak: newStreak, lastLogDate: t });
  }

  // ============================================
  // Cloud sync (Supabase)
  // ============================================
  let cloudPushTimer = null;
  let lastCloudPushKey = '';

  async function pullFromCloud() {
    const sb = initSupabase();
    if (!sb || !state.user) return;
    setState({ syncing: true });
    try {
      const uid = state.user.id;
      const today_ = today();
      const [profileR, mealsR, waterR, badgesR, statsR] = await Promise.all([
        sb.from('profiles').select('*').eq('user_id', uid).maybeSingle(),
        sb.from('meals').select('*').eq('user_id', uid).eq('log_date', today_).order('created_at', { ascending: false }),
        sb.from('water_logs').select('amount_ml').eq('user_id', uid).eq('log_date', today_),
        sb.from('user_badges').select('badge_id, earned_at').eq('user_id', uid),
        sb.from('user_stats').select('*').eq('user_id', uid).maybeSingle(),
      ]);

      const patch = {};
      if (profileR.data) {
        const p = profileR.data;
        if (p.user_name)  patch.userName = p.user_name;
        if (Number.isFinite(p.daily_goal)) patch.dailyGoal = p.daily_goal;
        if (p.accent && ACCENTS[p.accent]) patch.accent = p.accent;
        if (Number.isFinite(p.weight)) patch.weight = Number(p.weight);
        if (Number.isFinite(p.height)) patch.height = Number(p.height);
        if (typeof p.body_goal === 'string') patch.bodyGoal = p.body_goal;
        if (typeof p.dark_mode === 'boolean') patch.darkMode = p.dark_mode;
      }
      if (mealsR.data) {
        const meals = mealsR.data.map((m) => ({
          id: m.id, meal: m.meal_type || 'มื้อ', name: m.name, kcal: m.kcal,
          time: new Date(m.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          color: '#15a06a', tint: '#e3f4ea',
          protein: m.protein, carbs: m.carbs, fat: m.fat,
        }));
        patch.meals = meals;
        patch.consumed  = meals.reduce((a, m) => a + (m.kcal || 0), 0);
        patch.pConsumed = meals.reduce((a, m) => a + (m.protein || 0), 0);
        patch.cConsumed = meals.reduce((a, m) => a + (m.carbs || 0), 0);
        patch.fConsumed = meals.reduce((a, m) => a + (m.fat || 0), 0);
      }
      if (waterR.data) patch.water = waterR.data.reduce((a, w) => a + (w.amount_ml || 0), 0);
      if (badgesR.data) {
        const badges = {};
        badgesR.data.forEach((b) => { badges[b.badge_id] = b.earned_at; });
        patch.badges = badges;
      }
      if (statsR.data) {
        patch.streak = statsR.data.streak || 0;
        patch.lastLogDate = statsR.data.last_log_date || null;
        patch.totalScans = statsR.data.total_scans || 0;
      }
      setState({ ...patch, syncing: false });
      showToast('โหลดข้อมูลจาก cloud แล้ว', 'success');
    } catch (e) {
      setState({ syncing: false });
      showToast('โหลดจาก cloud ไม่สำเร็จ', 'info');
    }
  }

  function schedulePush() {
    if (!state.user || !initSupabase()) return;
    if (cloudPushTimer) clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(pushToCloud, 1500);
  }

  async function pushToCloud() {
    const sb = initSupabase();
    if (!sb || !state.user) return;
    const uid = state.user.id;
    const key = JSON.stringify([state.userName, state.dailyGoal, state.accent, state.weight, state.height, state.bodyGoal, state.darkMode, state.streak, state.lastLogDate, state.totalScans, Object.keys(state.badges).sort()]);
    if (key === lastCloudPushKey) return;
    lastCloudPushKey = key;
    try {
      await sb.from('profiles').upsert({
        user_id: uid,
        user_name: state.userName,
        daily_goal: state.dailyGoal,
        accent: state.accent,
        weight: state.weight,
        height: state.height,
        body_goal: state.bodyGoal,
        dark_mode: state.darkMode,
        updated_at: new Date().toISOString(),
      });
      await sb.from('user_stats').upsert({
        user_id: uid,
        streak: state.streak,
        last_log_date: state.lastLogDate,
        total_scans: state.totalScans,
        updated_at: new Date().toISOString(),
      });
      const badgeRows = Object.entries(state.badges).map(([badge_id, earned_at]) => ({ user_id: uid, badge_id, earned_at }));
      if (badgeRows.length) await sb.from('user_badges').upsert(badgeRows);
    } catch (e) {}
  }

  async function pushMealToCloud(meal) {
    const sb = initSupabase();
    if (!sb || !state.user) return;
    try {
      const { data } = await sb.from('meals').insert({
        user_id: state.user.id,
        log_date: today(),
        meal_type: meal.meal,
        name: meal.name,
        kcal: meal.kcal,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
      }).select().single();
      if (data && data.id) {
        const meals = state.meals.map((m) => m === meal ? { ...m, id: data.id } : m);
        state.meals = meals;
      }
    } catch (e) {}
  }

  async function deleteMealFromCloud(id) {
    const sb = initSupabase();
    if (!sb || !state.user) return;
    try { await sb.from('meals').delete().eq('id', id); } catch (e) {}
  }

  async function pushWaterToCloud(delta) {
    const sb = initSupabase();
    if (!sb || !state.user || !delta) return;
    try {
      await sb.from('water_logs').insert({
        user_id: state.user.id,
        log_date: today(),
        amount_ml: delta,
      });
    } catch (e) {}
  }

  // ============================================
  // Auth
  // ============================================
  function readAuthInputs() {
    const e = document.getElementById('ns-auth-email');
    const p = document.getElementById('ns-auth-pwd');
    return { email: (e && e.value || '').trim(), password: p && p.value || '' };
  }
  function showAuthError(msg) {
    const el = document.getElementById('ns-auth-err');
    if (el) { el.textContent = '⚠ ' + msg; el.style.display = 'block'; }
  }
  function clearAuthError() {
    const el = document.getElementById('ns-auth-err');
    if (el) el.style.display = 'none';
  }
  function setAuthBusyDom(busy, label) {
    const b = document.getElementById('ns-auth-submit');
    if (!b) return;
    b.disabled = busy;
    b.style.cursor = busy ? 'wait' : 'pointer';
    b.style.opacity = busy ? '.7' : '1';
    if (label) b.textContent = busy ? 'กำลังดำเนินการ...' : label;
  }

  async function authSignUp() {
    const sb = initSupabase();
    if (!sb) { showAuthError('ไม่ได้ตั้งค่า Supabase'); return; }
    const { email, password } = readAuthInputs();
    if (!email || !password) { showAuthError('กรอกอีเมลและรหัสผ่าน'); return; }
    clearAuthError();
    setAuthBusyDom(true, 'สมัครสมาชิก');
    try {
      const { data, error } = await sb.auth.signUp({ email, password });
      setAuthBusyDom(false, 'สมัครสมาชิก');
      if (error) { showAuthError(error.message); return; }
      if (data.session) {
        setState({ user: { id: data.user.id, email: data.user.email }, authOverlayOpen: false });
        await migrateLocalToCloud();
        await pullFromCloud();
      } else {
        showToast('สมัครสำเร็จ — กรุณาเช็คอีเมลเพื่อยืนยัน', 'success');
      }
    } catch (e) { setAuthBusyDom(false, 'สมัครสมาชิก'); showAuthError('สมัครไม่สำเร็จ'); }
  }

  async function authSignIn() {
    const sb = initSupabase();
    if (!sb) { showAuthError('ไม่ได้ตั้งค่า Supabase'); return; }
    const { email, password } = readAuthInputs();
    if (!email || !password) { showAuthError('กรอกอีเมลและรหัสผ่าน'); return; }
    clearAuthError();
    setAuthBusyDom(true, 'เข้าสู่ระบบ');
    try {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      setAuthBusyDom(false, 'เข้าสู่ระบบ');
      if (error) { showAuthError(error.message); return; }
      setState({ user: { id: data.user.id, email: data.user.email }, authOverlayOpen: false });
      showToast('เข้าสู่ระบบสำเร็จ', 'success');
      await pullFromCloud();
    } catch (e) { setAuthBusyDom(false, 'เข้าสู่ระบบ'); showAuthError('เข้าสู่ระบบไม่สำเร็จ'); }
  }

  async function authSignOut() {
    const sb = initSupabase();
    if (!sb) return;
    try { await sb.auth.signOut(); } catch (e) {}
    setState({ user: null });
    showToast('ออกจากระบบแล้ว — ข้อมูลในเครื่องยังอยู่', 'info');
  }

  async function migrateLocalToCloud() {
    const sb = initSupabase();
    if (!sb || !state.user) return;
    const uid = state.user.id;
    try {
      if (state.meals.length) {
        const rows = state.meals.map((m) => ({
          user_id: uid, log_date: today(),
          meal_type: m.meal, name: m.name,
          kcal: m.kcal || 0, protein: m.protein || 0,
          carbs: m.carbs || 0, fat: m.fat || 0,
        }));
        await sb.from('meals').insert(rows);
      }
      if (state.water > 0) {
        await sb.from('water_logs').insert({ user_id: uid, log_date: today(), amount_ml: state.water });
      }
      await pushToCloud();
    } catch (e) {}
  }

  let authModeMem = 'login';
  function setAuthMode(m) {
    authModeMem = m;
    clearAuthError();
    const tL = document.getElementById('ns-tab-login');
    const tS = document.getElementById('ns-tab-signup');
    const sub = document.getElementById('ns-auth-submit');
    const pwd = document.getElementById('ns-auth-pwd');
    const hint = document.getElementById('ns-auth-hint');
    if (tL && tS) {
      const on = (el, isOn) => {
        el.style.background = isOn ? '#fff' : 'transparent';
        el.style.color = isOn ? '#1b2722' : '#8a9890';
        el.style.boxShadow = isOn ? '0 2px 6px rgba(0,0,0,.06)' : 'none';
      };
      on(tL, m === 'login');
      on(tS, m === 'signup');
    }
    if (sub) {
      sub.textContent = m === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก';
      sub.onclick = m === 'login' ? authSignIn : authSignUp;
    }
    if (pwd) pwd.autocomplete = m === 'login' ? 'current-password' : 'new-password';
    if (hint) hint.textContent = m === 'signup' ? 'หลังสมัคร อาจต้องยืนยันอีเมลก่อนใช้งาน' : 'ลืมรหัส? ติดต่อทีม dev';
  }

  // ============================================
  // Package C: AI Premium actions
  // ============================================
  async function fetchRecommend() {
    if (state.recommendBusy) return;
    setState({ recommendBusy: true });
    const result = await callRecommend();
    setState({ recommendBusy: false, recommend: result || { name: 'อกไก่ย่างกับสลัด', kcal: 350, reason: 'ตัวเลือกเริ่มต้น (AI ไม่พร้อมตอนนี้)', meal_type: 'มื้อ' } });
  }
  async function fetchWeeklySummary() {
    if (state.summaryBusy) return;
    setState({ summaryBusy: true });
    const result = await callWeeklySummary();
    setState({ summaryBusy: false, weeklySummary: result || { summary: 'ไม่สามารถสรุปได้ตอนนี้', tips: [], warnings: [] } });
  }
  function openEdit() {
    if (!state.resultFood) return;
    setState({ editOpen: true, editFood: { ...state.resultFood } });
  }
  function openAuthOverlay()  { setState({ authOverlayOpen: true }); }
  function closeAuthOverlay() { setState({ authOverlayOpen: false }); }
  function closeEdit() { setState({ editOpen: false, editFood: null }); }
  function updateEditField(field, val) {
    if (!state.editFood) return;
    const n = parseInt(val, 10);
    const v = Number.isFinite(n) ? Math.max(0, Math.min(99999, n)) : 0;
    setState({ editFood: { ...state.editFood, [field]: v } });
  }
  function dragEdit(field, val) {
    if (!state.editFood) return;
    const n = parseInt(val, 10);
    state.editFood[field] = Number.isFinite(n) && n >= 0 ? Math.min(99999, n) : 0;
  }
  function saveEdit() {
    if (!state.editFood) return;
    setState({ resultFood: { ...state.editFood, confidence: 100 }, editOpen: false, editFood: null });
    showToast('แก้ไขค่าแล้ว', 'success');
  }

  function downloadCSV() {
    const header = 'date,meal,name,kcal,protein,carbs,fat';
    const rows = state.meals.map((m) =>
      [today(), m.meal, (m.name || '').replace(/,/g, ' '), m.kcal || 0, m.protein || 0, m.carbs || 0, m.fat || 0].join(','),
    );
    const csv = '﻿' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutriscan-meals-${today()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
    showToast('ดาวน์โหลดไฟล์แล้ว', 'success');
  }

  function go(page) {
    if (page === 'scan' && scanTimer) { clearTimeout(scanTimer); scanTimer = null; }
    const wasScan = state.page === 'scan';
    if (page === 'settings') {
      if (wasScan) stopCamera();
      setState({ page, settingsDraft:{
        userName: state.userName, dailyGoal: state.dailyGoal, accent: state.accent,
        weight: state.weight, height: state.height, bodyGoal: state.bodyGoal,
        darkMode: state.darkMode,
      } });
      return;
    }
    setState({ page, scanStage:'idle', searchOpen:false });
    if (wasScan && page !== 'scan') stopCamera();
    if (!wasScan && page === 'scan') startCamera();
  }
  function setMode(key)     { setState({ activeMode: key }); }
  function changeServing(d) {
    const s = Math.min(3, Math.max(0.5, Math.round((state.servings + d) * 2) / 2));
    setState({ servings: s });
  }
  async function onCapture() {
    if (state.scanStage === 'analyzing') return;
    setState({ scanStage:'analyzing' });
    const mode = state.activeMode;
    let blob = null;
    let food = null;

    if (mode === 'barcode') {
      const code = await decodeBarcodeFromVideo();
      if (code) {
        food = await callBarcodeAPI(code);
        if (!food) showToast('ไม่พบสินค้าในฐานข้อมูล', 'info');
      } else {
        showToast('ไม่พบบาร์โค้ดในภาพ — ลองอีกครั้ง', 'info');
      }
      blob = await captureVideoFrame();
    } else if (mode === 'food' || mode === 'label') {
      blob = await captureVideoFrame();
      if (blob) {
        const hash = await hashBlob(blob);
        const cached = cacheGet(hash);
        if (cached) {
          food = cached;
          showToast('ใช้ผลที่ cache ไว้ (ประหยัด quota)', 'info');
        } else if (API_URL) {
          food = await callRealAPI(blob, mode);
          if (food) cacheSet(hash, food);
        }
      }
    }

    if (!food) {
      await new Promise((r) => { scanTimer = setTimeout(r, API_URL ? 200 : 1900); });
      scanTimer = null;
      food = pickMock();
    }
    if (state.page !== 'scan') return;
    if (state.resultImage) URL.revokeObjectURL(state.resultImage);
    const imgUrl = blob ? URL.createObjectURL(blob) : null;
    setState({ scanStage:'idle', resultFood:food, resultImage:imgUrl, servings:1, page:'result' });
  }
  function saveResult() {
    const f = state.resultFood, s = state.servings;
    const kcal = Math.round(f.kcal * s);
    const p = Math.round(f.protein * s);
    const c = Math.round(f.carbs   * s);
    const fat = Math.round(f.fat   * s);
    const meal = { id: Date.now() + Math.random(), meal:'เพิ่มล่าสุด', name:f.name, kcal, time:'เมื่อสักครู่', color:'#15a06a', tint:'#e3f4ea', protein:p, carbs:c, fat };
    setState((st) => ({
      meals: [meal, ...st.meals],
      consumed:  st.consumed  + kcal,
      pConsumed: st.pConsumed + p,
      cConsumed: st.cConsumed + c,
      fConsumed: st.fConsumed + fat,
      totalScans: (st.totalScans || 0) + 1,
      page:'home',
      scanStage:'idle',
    }));
    updateStreakOnLog();
    pushHistory(kcal);
    checkBadges();
    if (state.user) pushMealToCloud(meal);
  }

  function pushHistory(kcal) {
    const t = today();
    const h = (state.history || []).slice();
    const idx = h.findIndex((x) => x.date === t);
    if (idx >= 0) h[idx] = { date: t, kcal: h[idx].kcal + kcal, meals: h[idx].meals + 1 };
    else h.push({ date: t, kcal, meals: 1 });
    while (h.length > 30) h.shift();
    setState({ history: h });
  }

  function openSearch() { setState({ searchOpen: true, searchQuery: '' }); }
  function closeSearch() { setState({ searchOpen: false, searchQuery: '' }); }
  function updateSearchQuery(q) { setState({ searchQuery: String(q).slice(0, 50) }); }
  function pickFromSearch(idx) {
    const f = FOODS[idx];
    if (!f) return;
    setState({ resultFood: f, resultImage: null, servings: 1, searchOpen: false, searchQuery: '', page: 'result' });
  }

  function toggleDarkMode() { setState({ darkMode: !state.darkMode }); }
  function deleteMeal(id) {
    const meal = state.meals.find((m) => String(m.id) === String(id));
    if (!meal) return;
    setState((st) => ({
      meals: st.meals.filter((m) => String(m.id) !== String(id)),
      consumed:  Math.max(0, st.consumed  - (meal.kcal    || 0)),
      pConsumed: Math.max(0, st.pConsumed - (meal.protein || 0)),
      cConsumed: Math.max(0, st.cConsumed - (meal.carbs   || 0)),
      fConsumed: Math.max(0, st.fConsumed - (meal.fat     || 0)),
    }));
    if (state.user) deleteMealFromCloud(id);
  }
  function dismissToast() { setState({ toast: null }); }
  function setAccent(name) { setState({ accent:name }); }
  async function onFilePicked(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    input.value = '';
    if (state.scanStage === 'analyzing') return;
    setState({ scanStage:'analyzing' });
    const mode = state.activeMode;
    let food = null;
    if (mode === 'food' || mode === 'label') {
      const hash = await hashBlob(file);
      const cached = cacheGet(hash);
      if (cached) {
        food = cached;
        showToast('ใช้ผลที่ cache ไว้ (ประหยัด quota)', 'info');
      } else if (API_URL) {
        food = await callRealAPI(file, mode);
        if (food) cacheSet(hash, food);
      }
    }
    if (!food) {
      await new Promise((r) => setTimeout(r, API_URL ? 200 : 1500));
      food = pickMock();
    }
    if (state.resultImage) URL.revokeObjectURL(state.resultImage);
    const imgUrl = URL.createObjectURL(file);
    setState({ scanStage:'idle', resultFood:food, resultImage:imgUrl, servings:1, page:'result' });
  }

  function updateDraft(field, val) {
    if (!state.settingsDraft) return;
    const d = { ...state.settingsDraft };
    if (field === 'userName')  d.userName  = String(val).slice(0, 30);
    if (field === 'dailyGoal') d.dailyGoal = rawInt(val, 99999);
    if (field === 'accent' && ACCENTS[val]) d.accent = val;
    if (field === 'weight')   d.weight   = rawFloat(val, 999);
    if (field === 'height')   d.height   = rawFloat(val, 999);
    if (field === 'bodyGoal') d.bodyGoal = BODY_GOALS.includes(val) || val === '' ? val : d.bodyGoal;
    if (field === 'darkMode') d.darkMode = !!val;
    setState({ settingsDraft:d });
  }
  function rawInt(val, hardMax) {
    const n = parseInt(val, 10);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(hardMax, n);
  }
  function rawFloat(val, hardMax) {
    const n = parseFloat(val);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(hardMax, Math.round(n * 10) / 10);
  }
  function dragGoal(val, source) {
    if (!state.settingsDraft) return;
    const n = rawInt(val, 99999);
    state.settingsDraft.dailyGoal = n;
    if (source !== 'num') {
      const num = document.getElementById('ns-input-goal');
      if (num) num.value = n;
    }
    if (source !== 'sld') {
      const sld = document.getElementById('ns-slider-goal');
      if (sld) sld.value = n;
    }
  }
  function dragNumeric(field, val) {
    if (!state.settingsDraft) return;
    if (field === 'weight' || field === 'height') {
      state.settingsDraft[field] = rawFloat(val, 999);
    }
  }
  function dragName(val) {
    if (!state.settingsDraft) return;
    state.settingsDraft.userName = String(val).slice(0, 30);
  }
  function clampGoal(val) {
    const n = parseInt(val, 10);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.min(4000, Math.max(800, n));
  }
  function clampNum(val, lo, hi) {
    const n = parseFloat(val);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.min(hi, Math.max(lo, Math.round(n * 10) / 10));
  }
  function saveSettings() {
    const d = state.settingsDraft;
    if (!d) return;
    const name = (d.userName || '').trim() || 'ผู้ใช้';
    setState({
      userName:  name,
      dailyGoal: clampGoal(d.dailyGoal),
      accent:    d.accent,
      weight:    clampNum(d.weight, 0, 250),
      height:    clampNum(d.height, 0, 230),
      bodyGoal:  d.bodyGoal,
      darkMode:  !!d.darkMode,
      settingsDraft:null,
      page:'home',
    });
  }
  function cancelSettings() { setState({ settingsDraft:null, page:'home' }); }
  function resetPrefs() {
    if (!confirm('รีเซ็ตเป็นค่าเริ่มต้น?\n• ชื่อ, เป้าหมาย, ข้อมูลร่างกาย, ธีม จะถูกล้าง\n• ข้อมูลมื้ออาหารและน้ำดื่มไม่ถูกแตะต้อง')) return;
    try { localStorage.removeItem(PREFS_KEY); } catch (e) {}
    const defaults = { userName:'ผู้ใช้', dailyGoal:0, accent:'green', weight:0, height:0, bodyGoal:'', darkMode:false };
    Object.assign(state, defaults);
    state.settingsDraft = null;
    savePrefs(state);
    setState({ page: 'home' });
    showToast('รีเซ็ตเป็นค่าเริ่มต้นแล้ว', 'success');
  }

  window.__ns = {
    go, setMode, onCapture, changeServing, saveResult, setAccent,
    updateDraft, saveSettings, cancelSettings, resetPrefs, onFilePicked, deleteMeal,
    addWater, resetWater,
    openSearch, closeSearch, updateSearchQuery, pickFromSearch,
    toggleDarkMode, downloadCSV, dismissToast,
    authSignUp, authSignIn, authSignOut, setAuthMode,
    pullFromCloud,
    fetchRecommend, fetchWeeklySummary,
    openEdit, closeEdit, updateEditField, dragEdit, saveEdit,
    openAuthOverlay, closeAuthOverlay,
    dragGoal, dragNumeric, dragName,
  };

  // ---------- HOME ----------
  function renderHome(v) {
    const macrosHtml = v.macros.map((m) => `
      <div style="background:#faf8f1;border:1px solid ${m.over ? '#ffd5cc' : '#efe9da'};border-radius:18px;padding:12px 11px;${m.over ? 'background:#fff5f3;' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font:600 12px 'IBM Plex Sans Thai';color:#56655d;">${esc(m.label)}${m.over ? ' ⚠️' : ''}</span>
          <span style="width:8px;height:8px;border-radius:50%;background:${m.displayColor};"></span>
        </div>
        <div style="font:800 16px 'Plus Jakarta Sans';color:${m.over ? '#e85a4f' : '#1b2722'};margin-top:7px;">${m.v}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;">/${m.g}${m.unit}</span></div>
        <div style="height:5px;border-radius:4px;background:#eef0ea;margin-top:8px;overflow:hidden;">
          <div style="height:100%;border-radius:4px;background:${m.displayColor};width:${m.pct}%;transition:width 1.1s ease;"></div>
        </div>
      </div>`).join('');

    const weekHtml = v.week.map((d) => `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end;">
        <div style="width:100%;max-width:24px;height:88px;border-radius:9px;background:#f0f2ec;display:flex;align-items:flex-end;overflow:hidden;">
          <div style="width:100%;border-radius:9px;height:${d.h};background:${d.fill};transition:height 1s cubic-bezier(.22,1,.36,1);box-shadow:${d.glow};"></div>
        </div>
        <span style="font:600 11px 'IBM Plex Sans Thai';color:${d.labelColor};">${esc(d.d)}</span>
      </div>`).join('');

    const mealsHtml = v.meals.length ? v.meals.map((meal) => `
      <div style="display:flex;align-items:center;gap:13px;background:#fff;border:1px solid #efe9da;border-radius:18px;padding:12px 14px;box-shadow:0 12px 28px -28px rgba(27,39,34,.4);">
        <div style="width:46px;height:46px;border-radius:14px;flex:none;background:${meal.tint};display:flex;align-items:center;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${meal.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"></path><path d="M12 11V4"></path><path d="M7 21V11"></path><path d="M17 21V11"></path><path d="M5 21h14"></path></svg>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font:600 14px 'IBM Plex Sans Thai';color:#1b2722;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(meal.name)}</div>
          <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">${esc(meal.meal)} · ${esc(meal.time)}</div>
        </div>
        <div style="font:800 15px 'Plus Jakarta Sans';color:#1b2722;">${meal.kcal}<span style="font:600 10px 'IBM Plex Sans Thai';color:#a4afa7;"> kcal</span></div>
        <button title="ลบมื้อนี้" onclick="if(confirm('ลบมื้อ ${esc(meal.name).replace(/'/g,'')} ?'))__ns.deleteMeal('${meal.id}')" style="width:30px;height:30px;border-radius:10px;border:1px solid #f0eadc;background:#fbf8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;flex:none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a4afa7" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
        </button>
      </div>`).join('') : `
      <div style="text-align:center;padding:24px 18px;background:#fff;border:1px dashed #d8d2c2;border-radius:18px;">
        <div style="font:600 13px 'IBM Plex Sans Thai';color:#1b2722;">ยังไม่ได้บันทึกมื้ออาหาร</div>
        <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:4px;">กดปุ่ม "สแกน" ด้านล่างเพื่อเริ่มบันทึก</div>
      </div>`;

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
          ${v.streak > 0 ? `<div style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,#fff5e6,#ffe8c8);color:#c25700;font:700 11px 'IBM Plex Sans Thai';padding:5px 10px;border-radius:999px;margin-top:6px;border:1px solid rgba(194,87,0,.15);">🔥 ${v.streak} วันติด</div>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:11px;">
          <button title="ตั้งค่า" onclick="__ns.go('settings')" style="width:44px;height:44px;border-radius:15px;background:#fff;border:1px solid #ece7da;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px -8px rgba(27,39,34,.18);cursor:pointer;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>
          </button>
          <button title="${v.user ? 'บัญชีของคุณ' : 'เข้าสู่ระบบ / สมัครสมาชิก'}" onclick="__ns.openAuthOverlay()" style="width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 18px 'Plus Jakarta Sans';color:#fff;background:linear-gradient(140deg,var(--accent),#86d3ad);box-shadow:0 8px 18px -8px rgba(21,160,106,.7);border:none;cursor:pointer;padding:0;">${esc(v.initial)}</button>
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
              <circle cx="100" cy="100" r="84" fill="none" stroke="${v.ringColor}" stroke-width="15" stroke-linecap="round" stroke-dasharray="528" style="stroke-dashoffset:${v.ringOffset};transition:stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1),stroke 0.4s;transform:rotate(-90deg);transform-origin:center;"></circle>
            </svg>
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div style="font:800 ${v.isOver ? '32' : '40'}px/1 'Plus Jakarta Sans';color:${v.isOver ? '#e85a4f' : '#1b2722'};letter-spacing:-1px;">${v.isOver ? '+' + v.overByLabel : v.remaining}</div>
              <div style="font:600 12px 'IBM Plex Sans Thai';color:${v.isOver ? '#e85a4f' : '#8a9890'};margin-top:4px;">kcal ${v.isOver ? 'เกินเป้า' : 'เหลือ'}</div>
            </div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:14px;">
            <div>
              <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">เป้าหมาย</div>
              <div style="font:800 19px 'Plus Jakarta Sans';color:#1b2722;">${v.goalLabel} <span style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;">kcal</span></div>
            </div>
            <div>
              <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">กินไปแล้ว</div>
              <div style="font:800 19px 'Plus Jakarta Sans';color:${v.ringColor};">${v.consumedLabel} <span style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;">kcal</span></div>
            </div>
            <div style="height:8px;border-radius:6px;background:#eef0ea;overflow:hidden;">
              <div style="height:100%;border-radius:6px;background:${v.isOver ? 'linear-gradient(90deg,#e85a4f,#ff8a5b)' : 'linear-gradient(90deg,var(--accent),#7ed0a8)'};width:${v.consumedPct}%;transition:width 1.2s cubic-bezier(.22,1,.36,1);"></div>
            </div>
            ${v.isOver ? `<div style="display:flex;align-items:center;gap:6px;font:600 11px 'IBM Plex Sans Thai';color:#e85a4f;background:#ffeae3;padding:6px 10px;border-radius:8px;border:1px solid #ffd5cc;">⚠️ กินเกินเป้าหมาย ${v.overByLabel} kcal</div>` : ''}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:18px;position:relative;">
          ${macrosHtml}
        </div>
      </div>

      <div style="margin:16px 18px 0;background:linear-gradient(165deg,#eaf5ff,#fff);border:1px solid #d8e9f5;border-radius:24px;padding:18px 18px 16px;box-shadow:0 18px 40px -34px rgba(76,141,255,.35);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:9px;">
            <span style="width:36px;height:36px;border-radius:12px;background:#dbeafe;display:flex;align-items:center;justify-content:center;font-size:18px;">💧</span>
            <div>
              <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">น้ำดื่มวันนี้</div>
              <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">${nf(v.water)} / ${nf(v.waterGoal)} มล.</div>
            </div>
          </div>
          <div style="font:800 22px 'Plus Jakarta Sans';color:#4c8dff;">${v.waterPct}<span style="font:600 12px 'IBM Plex Sans Thai';color:#8a9890;">%</span></div>
        </div>
        <div style="height:8px;border-radius:6px;background:#eaf0f7;margin-top:12px;overflow:hidden;">
          <div style="height:100%;border-radius:6px;background:linear-gradient(90deg,#4c8dff,#7fb3ff);width:${v.waterPct}%;transition:width 1s cubic-bezier(.22,1,.36,1);"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-top:14px;">
          <button onclick="__ns.addWater(100)" style="padding:9px 0;border:1px solid #d8e9f5;background:#fff;border-radius:12px;font:700 12px 'IBM Plex Sans Thai';color:#1b4d8c;cursor:pointer;">+100</button>
          <button onclick="__ns.addWater(250)" style="padding:9px 0;border:1px solid #d8e9f5;background:#fff;border-radius:12px;font:700 12px 'IBM Plex Sans Thai';color:#1b4d8c;cursor:pointer;">+250</button>
          <button onclick="__ns.addWater(500)" style="padding:9px 0;border:1px solid #d8e9f5;background:#fff;border-radius:12px;font:700 12px 'IBM Plex Sans Thai';color:#1b4d8c;cursor:pointer;">+500</button>
          <button onclick="__ns.resetWater()" title="รีเซ็ตน้ำดื่ม" style="padding:9px 0;border:1px solid #f4d8d8;background:#fff;border-radius:12px;font:700 12px 'IBM Plex Sans Thai';color:#a04545;cursor:pointer;">รีเซ็ต</button>
        </div>
      </div>

      <div style="margin:16px 18px 0;background:linear-gradient(165deg,#fdf2dd,#fff);border:1px solid #f0e3c2;border-radius:24px;padding:18px;box-shadow:0 18px 40px -34px rgba(194,140,30,.35);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">🤖</span>
            <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">AI แนะนำมื้อต่อไป</div>
          </div>
          <button onclick="__ns.fetchRecommend()" ${v.recommendBusy ? 'disabled' : ''} style="background:#fff;border:1px solid #f0e3c2;border-radius:999px;padding:6px 12px;font:700 11px 'IBM Plex Sans Thai';color:#9c6b00;cursor:${v.recommendBusy ? 'wait' : 'pointer'};opacity:${v.recommendBusy ? .6 : 1};">${v.recommendBusy ? 'กำลังคิด...' : (v.recommend ? '↻ ใหม่' : '✨ ถาม AI')}</button>
        </div>
        ${v.recommend ? `
          <div style="background:#fff;border:1px solid #f0e3c2;border-radius:14px;padding:14px;margin-top:8px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
              <div style="flex:1;min-width:0;">
                <div style="font:700 15px 'IBM Plex Sans Thai';color:#1b2722;">${esc(v.recommend.name)}</div>
                <div style="font:500 11.5px/1.5 'IBM Plex Sans Thai';color:#8a9890;margin-top:4px;">${esc(v.recommend.reason || '')}</div>
              </div>
              <div style="text-align:right;flex:none;">
                <div style="font:800 18px 'Plus Jakarta Sans';color:#9c6b00;">${v.recommend.kcal}<span style="font:600 10px 'IBM Plex Sans Thai';color:#a4afa7;"> kcal</span></div>
                ${v.recommend.meal_type ? `<div style="font:600 10px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">${esc(v.recommend.meal_type)}</div>` : ''}
              </div>
            </div>
          </div>` : `
          <div style="font:500 12px/1.6 'IBM Plex Sans Thai';color:#8a9890;">กดปุ่ม "ถาม AI" เพื่อให้ AI วิเคราะห์มาโครที่เหลือและแนะนำเมนูที่เหมาะกับช่วงเวลาตอนนี้</div>`}
      </div>

      ${v.earnedBadges.length > 0 ? `
      <div style="margin:16px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:22px;padding:16px 18px;box-shadow:0 12px 28px -28px rgba(27,39,34,.4);">
        <div style="font:700 13px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:10px;">เหรียญที่ได้</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${v.earnedBadges.map((b) => `<div title="${esc(b.name)}" style="display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,#fff5e6,#ffe8c8);border:1px solid rgba(194,87,0,.15);border-radius:999px;padding:6px 11px;font:600 11.5px 'IBM Plex Sans Thai';color:#1b2722;"><span>${b.icon}</span>${esc(b.name)}</div>`).join('')}
        </div>
      </div>` : ''}

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
          <div style="display:flex;align-items:center;gap:6px;">
            <button onclick="__ns.openSearch()" title="ค้นหาอาหาร" style="background:none;border:none;display:flex;align-items:center;gap:4px;font:700 12px 'IBM Plex Sans Thai';color:var(--accent);cursor:pointer;padding:6px 10px;border-radius:10px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>ค้นหา
            </button>
            <button onclick="__ns.go('scan')" style="background:none;border:none;font:700 12px 'IBM Plex Sans Thai';color:var(--accent);cursor:pointer;padding:6px 10px;border-radius:10px;">+ สแกน</button>
          </div>
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
            <div style="font:800 19px 'Plus Jakarta Sans','IBM Plex Sans Thai';margin-top:3px;">${esc(v.bodyGoalLabel)}</div>
          </div>
          <button onclick="__ns.go('settings')" style="background:rgba(126,208,168,.18);color:#9fe3bf;font:700 11px 'IBM Plex Sans Thai';padding:7px 12px;border-radius:999px;border:none;cursor:pointer;">ตั้งค่า</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px;position:relative;">
          ${bodyHtml}
        </div>
        ${v.bmiAdvice ? `
        <div style="display:flex;align-items:flex-start;gap:8px;margin-top:14px;padding:10px 12px;background:${v.bmiAdvice.level === 'warn' ? 'rgba(232,90,79,.15)' : v.bmiAdvice.level === 'caution' ? 'rgba(245,165,36,.15)' : 'rgba(126,208,168,.18)'};border:1px solid ${v.bmiAdvice.level === 'warn' ? 'rgba(232,90,79,.35)' : v.bmiAdvice.level === 'caution' ? 'rgba(245,165,36,.35)' : 'rgba(126,208,168,.3)'};border-radius:12px;position:relative;">
          <span style="font-size:14px;flex:none;line-height:1.5;">${v.bmiAdvice.level === 'ok' ? '✓' : 'ⓘ'}</span>
          <div>
            <div style="font:700 12px 'IBM Plex Sans Thai';color:${v.bmiAdvice.level === 'warn' ? '#ffb6ad' : v.bmiAdvice.level === 'caution' ? '#ffd58a' : '#9fe3bf'};">BMI ${v.bmiValue.toFixed(1)} · ${esc(v.bmiAdvice.label)}</div>
            <div style="font:500 11px 'IBM Plex Sans Thai';color:#aebfb4;margin-top:3px;line-height:1.45;">${esc(v.bmiAdvice.tip)}</div>
          </div>
        </div>` : `
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;font:500 11.5px 'IBM Plex Sans Thai';color:#9fe3bf;position:relative;">
          <span style="width:6px;height:6px;border-radius:50%;background:#9fe3bf;"></span>กรอกข้อมูลร่างกายเพื่อให้ AI ช่วยคำนวณเป้าหมายให้คุณ
        </div>`}
        <div style="font:500 10.5px 'IBM Plex Sans Thai';color:#7a8c84;margin-top:8px;line-height:1.5;position:relative;">
          * ค่า TDEE และ BMI เป็นค่าประมาณ ไม่ใช่คำวินิจฉัยทางการแพทย์ — ปรึกษาแพทย์/นักโภชนาการสำหรับคำแนะนำส่วนบุคคล
        </div>
      </div>
    </section>`;
  }

  // ---------- SCAN ----------
  function renderScan(v) {
    const modesHtml = v.modes.map((m) => `
      <button class="ns-chip" onclick="__ns.setMode('${m.key}')" style="white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 6px;border-radius:999px;border:1px solid ${m.border};background:${m.bg};color:${m.fg};font:600 11.5px 'IBM Plex Sans Thai';cursor:pointer;transition:all .2s;">
        <span style="width:6px;height:6px;border-radius:50%;background:${m.dot};flex:none;"></span>${esc(m.label)}
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

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:16px 22px 0;position:relative;z-index:3;flex:none;">
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
        <div title="${v.confidence < 70 ? 'ความมั่นใจต่ำ ตรวจสอบกับฉลากจริง' : 'AI วิเคราะห์อย่างมั่นใจ'}" style="display:flex;align-items:center;gap:6px;background:${v.confidence < 70 ? 'rgba(245,165,36,.15)' : 'var(--accent-soft)'};color:${v.confidence < 70 ? '#c97a00' : 'var(--accent)'};font:800 11px 'Plus Jakarta Sans';padding:8px 11px;border-radius:999px;white-space:nowrap;border:1px solid ${v.confidence < 70 ? 'rgba(245,165,36,.35)' : 'transparent'};">${v.confidence < 70 ? '⚠ ' : ''}AI ${v.confidence}%</div>
      </header>

      <div style="margin:8px 18px 0;border-radius:28px;overflow:hidden;background:#fff;border:1px solid #efe9da;box-shadow:0 24px 50px -34px rgba(27,39,34,.45);">
        <div style="height:200px;position:relative;overflow:hidden;${v.resultImage ? 'background:#1b2722;' : 'background:repeating-linear-gradient(45deg,#eee7d6,#eee7d6 13px,#f6f1e4 13px,#f6f1e4 26px);display:flex;align-items:center;justify-content:center;'}">
          ${v.resultImage
            ? `<img src="${v.resultImage}" alt="รูปที่สแกน" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`
            : `<span style="font:600 11px 'Plus Jakarta Sans';color:#b3aa93;letter-spacing:.5px;">FOOD PHOTO</span>`}
          <div style="position:absolute;left:14px;top:14px;display:flex;align-items:center;gap:6px;background:rgba(27,39,34,.82);color:#9fe3bf;font:600 11px 'IBM Plex Sans Thai';padding:7px 11px;border-radius:999px;backdrop-filter:blur(4px);z-index:2;"><span style="width:6px;height:6px;border-radius:50%;background:#9fe3bf;"></span>ตรวจพบแล้ว</div>
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

      <div style="margin:14px 18px 0;display:flex;gap:9px;">
        <button onclick="__ns.openEdit()" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:14px;border:1px solid #e2ddcf;background:#fff;font:700 12.5px 'IBM Plex Sans Thai';color:#1b2722;cursor:pointer;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>แก้ไขค่า
        </button>
      </div>

      <div style="margin:9px 18px 0;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #efe9da;border-radius:20px;padding:14px 16px;">
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
        <div style="margin-top:10px;padding-top:12px;border-top:1px solid #f1ede1;font:500 10.5px/1.55 'IBM Plex Sans Thai';color:#7a8c84;">
          <strong style="color:#56655d;font-weight:700;">ที่มา:</strong> ค่า % ต่อวันอ้างอิง <em>Thai RDI</em> (Recommended Daily Intake) โดยคิดจากความต้องการพลังงานเฉลี่ย 2,000 kcal/วันสำหรับคนไทยอายุ 6 ปีขึ้นไป<br><br>
          <strong style="color:#56655d;font-weight:700;">ข้อจำกัด:</strong> ผลการวิเคราะห์ใช้เป็น guideline เท่านั้น ไม่ใช่คำแนะนำทางการแพทย์หรือโภชนาการเฉพาะบุคคล หากมีโรคประจำตัว/อาการแพ้/ภาวะพิเศษ ปรึกษาแพทย์หรือนักโภชนาการก่อนตัดสินใจ
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

  // ---------- AUTH CARD (in Settings) ----------
  function renderAuthCard(v) {
    if (!SB_URL || !SB_KEY) return '';
    if (v.user) {
      return `
      <div style="margin:14px 18px 0;background:linear-gradient(150deg,#1f2b24,#2c3a30);border-radius:24px;padding:20px;color:#fff;box-shadow:0 22px 46px -30px rgba(27,39,34,.6);">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:46px;height:46px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font:800 18px 'Plus Jakarta Sans';color:#fff;flex:none;">${esc((v.user.email || 'U').charAt(0).toUpperCase())}</div>
          <div style="flex:1;min-width:0;">
            <div style="font:600 12px 'IBM Plex Sans Thai';color:#9fe3bf;">เข้าสู่ระบบแล้ว</div>
            <div style="font:700 14px 'Plus Jakarta Sans';color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">${esc(v.user.email)}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;font:500 11.5px 'IBM Plex Sans Thai';color:#9fe3bf;">
          <span style="width:6px;height:6px;border-radius:50%;background:#9fe3bf;"></span>${v.syncing ? 'กำลัง sync...' : 'ข้อมูลถูก sync ขึ้น cloud แบบอัตโนมัติ'}
        </div>
        <div style="display:flex;gap:9px;margin-top:14px;">
          <button onclick="__ns.pullFromCloud()" style="flex:1;padding:11px 0;border-radius:13px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#9fe3bf;font:700 12.5px 'IBM Plex Sans Thai';cursor:pointer;">↻ โหลดใหม่</button>
          <button onclick="__ns.authSignOut()" style="flex:1;padding:11px 0;border-radius:13px;border:1px solid rgba(255,170,120,.3);background:rgba(255,170,120,.1);color:#ffaa78;font:700 12.5px 'IBM Plex Sans Thai';cursor:pointer;">ออกจากระบบ</button>
        </div>
      </div>`;
    }
    const mode = authModeMem;
    const tabStyle = (on) => `flex:1;padding:8px;border-radius:9px;border:none;background:${on ? '#fff' : 'transparent'};font:700 12.5px 'IBM Plex Sans Thai';color:${on ? '#1b2722' : '#8a9890'};cursor:pointer;box-shadow:${on ? '0 2px 6px rgba(0,0,0,.06)' : 'none'};`;
    return `
    <div style="margin:14px 18px 0;background:linear-gradient(165deg,#fff,#fbfaf5);border:1px solid #efe9da;border-radius:24px;padding:20px;box-shadow:0 18px 40px -36px rgba(27,39,34,.4);">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:6px;">
        <span style="font-size:18px;">☁️</span>
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">Sync ข้ามอุปกรณ์ (Cloud)</div>
      </div>
      <div style="font:500 12px/1.5 'IBM Plex Sans Thai';color:#8a9890;margin-bottom:14px;">Login เพื่อ sync ข้อมูลข้ามอุปกรณ์ — เปลี่ยนเครื่องใหม่ login → ข้อมูลตามไปด้วย</div>

      <div style="display:flex;gap:6px;background:#f0eadc;padding:4px;border-radius:12px;margin-bottom:14px;">
        <button id="ns-tab-login"  onclick="__ns.setAuthMode('login')"  style="${tabStyle(mode === 'login')}">เข้าสู่ระบบ</button>
        <button id="ns-tab-signup" onclick="__ns.setAuthMode('signup')" style="${tabStyle(mode === 'signup')}">สมัครสมาชิก</button>
      </div>

      <input id="ns-auth-email" type="email" placeholder="อีเมล" autocomplete="email" style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid #e2ddcf;background:#faf8f1;font:600 13.5px 'IBM Plex Sans Thai';color:#1b2722;outline:none;margin-bottom:9px;">
      <input id="ns-auth-pwd" type="password" placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" style="width:100%;padding:12px 14px;border-radius:12px;border:1px solid #e2ddcf;background:#faf8f1;font:600 13.5px 'IBM Plex Sans Thai';color:#1b2722;outline:none;">

      <div id="ns-auth-err" style="display:none;font:600 11.5px 'IBM Plex Sans Thai';color:#e85a4f;margin-top:9px;padding:8px 10px;background:#ffeae3;border-radius:9px;"></div>

      <button id="ns-auth-submit" onclick="__ns.${mode === 'login' ? 'authSignIn' : 'authSignUp'}()" style="width:100%;margin-top:12px;padding:13px;border-radius:13px;border:none;background:var(--accent);color:#fff;font:700 14px 'IBM Plex Sans Thai';cursor:pointer;">
        ${mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
      </button>

      <div id="ns-auth-hint" style="font:500 10.5px/1.5 'IBM Plex Sans Thai';color:#8a9890;margin-top:10px;text-align:center;">
        ${mode === 'signup' ? 'หลังสมัคร อาจต้องยืนยันอีเมลก่อนใช้งาน' : 'ลืมรหัส? ติดต่อทีม dev'}
      </div>
    </div>`;
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
        <input id="ns-input-name" type="text" value="${esc(d.userName)}" maxlength="30" oninput="__ns.dragName(this.value)" style="width:100%;padding:13px 14px;border-radius:14px;border:1px solid #e2ddcf;background:#faf8f1;font:600 14px 'IBM Plex Sans Thai';color:#1b2722;outline:none;">

        <label style="display:block;font:600 12px 'IBM Plex Sans Thai';color:#56655d;margin:18px 0 6px;">เป้าหมายแคลอรีต่อวัน <span style="font-weight:500;color:#8a9890;">(0 = ยังไม่ตั้ง)</span></label>
        <div style="display:flex;align-items:center;gap:12px;">
          <input id="ns-input-goal" type="number" min="0" max="4000" step="1" value="${d.dailyGoal}" oninput="__ns.dragGoal(this.value,'num')" style="flex:none;width:110px;padding:13px 14px;border-radius:14px;border:1px solid #e2ddcf;background:#faf8f1;font:700 16px 'Plus Jakarta Sans';color:#1b2722;outline:none;text-align:center;">
          <input id="ns-slider-goal" type="range" min="0" max="4000" step="10" value="${d.dailyGoal}" oninput="__ns.dragGoal(this.value,'sld')" style="flex:1;accent-color:${ACCENTS[d.accent][0]};">
        </div>
        <div style="font:500 11px/1.5 'IBM Plex Sans Thai';color:#8a9890;margin-top:6px;">พิมพ์เลขในช่องซ้ายเพื่อระบุค่าแม่นยำ (เช่น 1518) หรือลากแถบเพื่อปรับคร่าว ๆ<br><strong style="color:#56655d;font-weight:600;">ช่วงแนะนำ:</strong> ผู้ใหญ่ทั่วไป 1,200–3,500 kcal/วัน — ต่ำกว่า/สูงกว่านี้ควรปรึกษาแพทย์</div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:20px;box-shadow:0 18px 40px -36px rgba(27,39,34,.4);">
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:14px;">ข้อมูลร่างกาย</div>

        <div style="display:flex;gap:11px;">
          <div style="flex:1;">
            <label style="display:block;font:600 12px 'IBM Plex Sans Thai';color:#56655d;margin-bottom:6px;">น้ำหนัก (กก.)</label>
            <input id="ns-input-weight" type="number" min="0" max="250" step="0.1" value="${d.weight || ''}" placeholder="0" oninput="__ns.dragNumeric('weight', this.value)" style="width:100%;padding:13px 14px;border-radius:14px;border:1px solid #e2ddcf;background:#faf8f1;font:700 16px 'Plus Jakarta Sans';color:#1b2722;outline:none;text-align:center;">
          </div>
          <div style="flex:1;">
            <label style="display:block;font:600 12px 'IBM Plex Sans Thai';color:#56655d;margin-bottom:6px;">ส่วนสูง (ซม.)</label>
            <input id="ns-input-height" type="number" min="0" max="230" step="1" value="${d.height || ''}" placeholder="0" oninput="__ns.dragNumeric('height', this.value)" style="width:100%;padding:13px 14px;border-radius:14px;border:1px solid #e2ddcf;background:#faf8f1;font:700 16px 'Plus Jakarta Sans';color:#1b2722;outline:none;text-align:center;">
          </div>
        </div>

        <label style="display:block;font:600 12px 'IBM Plex Sans Thai';color:#56655d;margin:18px 0 8px;">เป้าหมายของคุณ</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${['', ...BODY_GOALS].map((g) => {
            const on = (d.bodyGoal || '') === g;
            const lbl = g === '' ? 'ยังไม่ตั้ง' : g;
            const c = ACCENTS[d.accent][0];
            return `<button onclick="__ns.updateDraft('bodyGoal','${g}')" style="flex:1 1 calc(50% - 4px);padding:11px 8px;border-radius:14px;border:1px solid ${on ? c : '#e2ddcf'};background:${on ? ACCENTS[d.accent][1] : '#faf8f1'};color:${on ? c : '#1b2722'};font:700 12.5px 'IBM Plex Sans Thai';cursor:pointer;transition:all .2s;">${lbl}</button>`;
          }).join('')}
        </div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:20px;box-shadow:0 18px 40px -36px rgba(27,39,34,.4);">
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:14px;">สีธีมของแอป</div>
        <div style="display:flex;gap:10px;">${swatchHtml}</div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:18px;border-top:1px solid #f0eadc;">
          <div>
            <div style="font:700 13px 'IBM Plex Sans Thai';color:#1b2722;">โหมดมืด</div>
            <div style="font:500 11.5px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">เปลี่ยนเป็นพื้นหลังสีเข้ม สบายตาเวลากลางคืน</div>
          </div>
          <button onclick="__ns.updateDraft('darkMode', ${d.darkMode ? 'false' : 'true'})" style="position:relative;width:54px;height:30px;border:none;border-radius:999px;background:${d.darkMode ? ACCENTS[d.accent][0] : '#e2ddcf'};cursor:pointer;transition:background .25s;padding:0;">
            <span style="position:absolute;top:3px;left:${d.darkMode ? '27px' : '3px'};width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.2);transition:left .25s;"></span>
          </button>
        </div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:24px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div>
          <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">ดาวน์โหลดประวัติมื้อ (CSV)</div>
          <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-top:3px;">ส่งออกข้อมูลมื้ออาหารของวันนี้เป็นไฟล์ CSV</div>
        </div>
        <button onclick="__ns.downloadCSV()" style="flex:none;padding:10px 14px;border-radius:12px;border:1px solid #d8e9f5;background:#eaf5ff;font:700 12.5px 'IBM Plex Sans Thai';color:#1b4d8c;cursor:pointer;display:flex;align-items:center;gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b4d8c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>ส่งออก
        </button>
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

      <div style="margin:24px 18px 0;padding:16px 18px;background:#fbf8f0;border:1px solid #efe9da;border-radius:16px;">
        <div style="display:flex;align-items:flex-start;gap:9px;">
          <span style="font-size:14px;flex:none;line-height:1.5;">ⓘ</span>
          <div style="font:500 11.5px/1.55 'IBM Plex Sans Thai';color:#56655d;">
            <strong style="font-weight:700;color:#1b2722;">ข้อจำกัดความรับผิดชอบ</strong><br>
            NutriScan AI ใช้เป็นเครื่องมือช่วยติดตามโภชนาการเบื้องต้นเท่านั้น ค่าที่แสดง (TDEE, BMI, แคลอรี, สารอาหาร) เป็นค่าประมาณจากสูตรมาตรฐาน <strong style="font-weight:700;">ไม่ใช่คำวินิจฉัยหรือคำแนะนำทางการแพทย์</strong> หากต้องการแผนโภชนาการเฉพาะบุคคล หรือมีโรคประจำตัว/ภาวะพิเศษ กรุณาปรึกษาแพทย์ นักโภชนาการ หรือบุคลากรทางการแพทย์ที่มีใบประกอบวิชาชีพ
          </div>
        </div>
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
      <button onclick="__ns.go('report')" style="display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:none;cursor:pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${v.navReportColor}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20V10M12 20V4M18 20v-6"></path></svg>
        <span style="font:600 10.5px 'IBM Plex Sans Thai';color:${v.navReportColor};">รายงาน</span>
      </button>
    </nav>`;
  }

  // ---------- AUTH OVERLAY (from avatar button) ----------
  function renderAuthOverlay(v) {
    if (!v.authOverlayOpen) return '';
    if (!SB_URL || !SB_KEY) return '';
    const inner = renderAuthCard(v);
    return `
    <div onclick="if(event.target===this)__ns.closeAuthOverlay()" style="position:absolute;inset:0;z-index:55;background:rgba(0,0,0,.5);display:flex;align-items:flex-start;justify-content:center;padding-top:60px;animation:ns-fadeUp .25s both;">
      <div style="width:calc(100% - 32px);max-width:380px;max-height:calc(100% - 100px);overflow-y:auto;position:relative;">
        <button onclick="__ns.closeAuthOverlay()" style="position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:11px;border:1px solid #e2ddcf;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2;box-shadow:0 6px 14px -6px rgba(0,0,0,.25);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
        </button>
        ${inner}
      </div>
    </div>`;
  }

  // ---------- EDIT RESULT OVERLAY ----------
  function renderEditOverlay(v) {
    if (!v.editOpen || !v.editFood) return '';
    const f = v.editFood;
    const row = (label, field, unit, val) => `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #f1ede1;">
        <label style="font:600 13px 'IBM Plex Sans Thai';color:#1b2722;">${esc(label)}</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <input id="ns-edit-${field}" type="number" min="0" max="9999" value="${val}" oninput="__ns.dragEdit('${field}', this.value)" style="width:80px;padding:8px 10px;border-radius:10px;border:1px solid #e2ddcf;background:#faf8f1;font:700 14px 'Plus Jakarta Sans';color:#1b2722;outline:none;text-align:center;">
          <span style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">${esc(unit)}</span>
        </div>
      </div>`;
    return `
    <div style="position:absolute;inset:0;z-index:55;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;animation:ns-fadeUp .25s both;">
      <div style="background:#f4f1ea;border-radius:24px 24px 0 0;width:100%;max-height:88%;overflow-y:auto;padding:20px 22px 28px;box-shadow:0 -20px 50px rgba(0,0,0,.3);">
        <div style="width:40px;height:4px;border-radius:2px;background:#d8d2c2;margin:0 auto 14px;"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font:700 16px 'IBM Plex Sans Thai';color:#1b2722;">แก้ไขค่าโภชนาการ</div>
          <button onclick="__ns.closeEdit()" style="width:34px;height:34px;border-radius:11px;border:1px solid #e2ddcf;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
          </button>
        </div>
        <div style="font:500 12px 'IBM Plex Sans Thai';color:#8a9890;margin-bottom:8px;">แก้ค่าถ้า AI วิเคราะห์ผิด (ค่าต่อ 1 หน่วยบริโภค)</div>
        ${row('พลังงาน', 'kcal', 'kcal', f.kcal || 0)}
        ${row('โปรตีน', 'protein', 'g', f.protein || 0)}
        ${row('คาร์โบไฮเดรต', 'carbs', 'g', f.carbs || 0)}
        ${row('ไขมัน', 'fat', 'g', f.fat || 0)}
        ${row('น้ำตาล', 'sugar', 'g', f.sugar || 0)}
        ${row('โซเดียม', 'sodium', 'mg', f.sodium || 0)}
        <button onclick="__ns.saveEdit()" style="width:100%;margin-top:20px;padding:13px;border-radius:14px;border:none;background:var(--accent);color:#fff;font:700 14px 'IBM Plex Sans Thai';cursor:pointer;">บันทึกการแก้ไข</button>
      </div>
    </div>`;
  }

  // ---------- SEARCH OVERLAY ----------
  function renderSearchOverlay(v) {
    if (!v.searchOpen) return '';
    const list = v.searchResults.map((f) => `
      <button onclick="__ns.pickFromSearch(${f.idx})" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:#fff;border:1px solid #efe9da;border-radius:14px;padding:12px 14px;cursor:pointer;">
        <span style="width:40px;height:40px;border-radius:11px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;flex:none;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"></path><path d="M12 11V4"></path><path d="M7 21V11"></path><path d="M17 21V11"></path><path d="M5 21h14"></path></svg>
        </span>
        <span style="flex:1;min-width:0;">
          <span style="display:block;font:600 13.5px 'IBM Plex Sans Thai';color:#1b2722;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(f.name)}</span>
          <span style="display:block;font:500 11px 'IBM Plex Sans Thai';color:#8a9890;margin-top:2px;">${esc(f.tag)}</span>
        </span>
        <span style="font:800 14px 'Plus Jakarta Sans';color:#1b2722;flex:none;">${f.kcal}<span style="font:600 10px 'IBM Plex Sans Thai';color:#a4afa7;"> kcal</span></span>
      </button>`).join('');
    const empty = v.searchResults.length === 0 ? `
      <div style="text-align:center;padding:40px 20px;color:#8a9890;font:500 13px 'IBM Plex Sans Thai';">ไม่พบเมนูที่ตรงกับ "${esc(v.searchQuery)}"</div>` : '';
    return `
    <div style="position:absolute;inset:0;z-index:50;background:rgba(244,241,234,.98);backdrop-filter:blur(6px);display:flex;flex-direction:column;animation:ns-fadeUp .3s both;">
      <header style="display:flex;align-items:center;gap:10px;padding:20px 18px 12px;border-bottom:1px solid #efe9da;">
        <button onclick="__ns.closeSearch()" style="width:38px;height:38px;border-radius:12px;background:#fff;border:1px solid #ece7da;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>
        </button>
        <input id="ns-search-input" type="text" value="${esc(v.searchQuery)}" oninput="__ns.updateSearchQuery(this.value)" placeholder="พิมพ์ชื่อเมนู เช่น 'กะเพรา'" autofocus style="flex:1;padding:11px 14px;border-radius:12px;border:1px solid #e2ddcf;background:#fff;font:600 14px 'IBM Plex Sans Thai';color:#1b2722;outline:none;">
      </header>
      <div style="flex:1;overflow-y:auto;padding:14px 18px 18px;display:flex;flex-direction:column;gap:8px;">
        ${list}${empty}
      </div>
    </div>`;
  }

  // ---------- WEEKLY REPORT ----------
  function renderReport(v) {
    const goal = state.dailyGoal;
    const bigChart = v.week.map((d, i) => `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;height:100%;justify-content:flex-end;">
        <div style="font:700 11px 'Plus Jakarta Sans';color:${d.fill === '#d3ddd5' ? '#a4afa7' : v.accent};">${d.val > 0 ? Math.round(d.val) : ''}</div>
        <div style="width:100%;max-width:34px;height:160px;border-radius:12px;background:#f0f2ec;display:flex;align-items:flex-end;overflow:hidden;">
          <div style="width:100%;border-radius:12px;height:${d.h};background:${d.fill};transition:height 1s cubic-bezier(.22,1,.36,1);box-shadow:${d.glow};"></div>
        </div>
        <span style="font:700 12px 'IBM Plex Sans Thai';color:${d.labelColor};">${esc(d.d)}</span>
      </div>`).join('');

    const totalKcal = v.weekDays.reduce((a, x) => a + x.val, 0);
    const totalMeals = v.weekDays.reduce((a, x) => a + (x.mealCount || 0), 0);
    const adherenceDays = goal > 0 ? v.weekDays.filter((x) => x.val > 0 && x.val <= goal).length : 0;
    const adherencePct = goal > 0 ? Math.round(adherenceDays / 7 * 100) : 0;

    const topFoodMap = {};
    state.meals.forEach((m) => { topFoodMap[m.name] = (topFoodMap[m.name] || 0) + 1; });
    const topFoods = Object.entries(topFoodMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topFoodsHtml = topFoods.length > 0
      ? topFoods.map(([name, count]) => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f1ede1;">
          <span style="font:600 13px 'IBM Plex Sans Thai';color:#1b2722;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:8px;">${esc(name)}</span>
          <span style="font:700 12px 'IBM Plex Sans Thai';color:var(--accent);flex:none;">${count}×</span>
        </div>`).join('')
      : `<div style="text-align:center;padding:20px 0;color:#8a9890;font:500 12.5px 'IBM Plex Sans Thai';">ยังไม่มีข้อมูลพอ — บันทึกมื้ออาหารเพื่อดูสถิติ</div>`;

    return `
    <section class="${v.screenAnim ? 'ns-screen' : ''}" style="height:100%;overflow-y:auto;padding:0 0 120px;">
      <header style="display:flex;align-items:center;justify-content:space-between;padding:24px 22px 8px;">
        <button onclick="__ns.go('home')" style="width:42px;height:42px;border-radius:14px;background:#fff;border:1px solid #ece7da;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 16px -10px rgba(27,39,34,.3);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1b2722" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
        </button>
        <div style="font:700 16px 'IBM Plex Sans Thai';color:#1b2722;">รายงานสัปดาห์</div>
        <div style="width:42px;"></div>
      </header>

      <div style="margin:8px 18px 0;background:linear-gradient(165deg,#fdf2dd,#fff);border:1px solid #f0e3c2;border-radius:24px;padding:20px;box-shadow:0 18px 40px -34px rgba(194,140,30,.35);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:18px;">🤖</span>
            <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">AI สรุปสัปดาห์</div>
          </div>
          <button onclick="__ns.fetchWeeklySummary()" ${v.summaryBusy ? 'disabled' : ''} style="background:#fff;border:1px solid #f0e3c2;border-radius:999px;padding:6px 12px;font:700 11px 'IBM Plex Sans Thai';color:#9c6b00;cursor:${v.summaryBusy ? 'wait' : 'pointer'};opacity:${v.summaryBusy ? .6 : 1};">${v.summaryBusy ? 'กำลังคิด...' : (v.weeklySummary ? '↻ ใหม่' : '✨ ขอ AI สรุป')}</button>
        </div>
        ${v.weeklySummary ? `
          <div style="font:500 12.5px/1.6 'IBM Plex Sans Thai';color:#1b2722;margin-top:6px;">${esc(v.weeklySummary.summary || '')}</div>
          ${(v.weeklySummary.tips || []).length > 0 ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f0e3c2;">
            <div style="font:700 11px 'IBM Plex Sans Thai';color:#9c6b00;margin-bottom:5px;">💡 คำแนะนำ</div>
            ${v.weeklySummary.tips.map((t) => `<div style="font:500 11.5px/1.5 'IBM Plex Sans Thai';color:#56655d;margin-top:4px;">• ${esc(t)}</div>`).join('')}
          </div>` : ''}
          ${(v.weeklySummary.warnings || []).length > 0 ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f0e3c2;">
            <div style="font:700 11px 'IBM Plex Sans Thai';color:#e85a4f;margin-bottom:5px;">⚠️ ข้อสังเกต</div>
            ${v.weeklySummary.warnings.map((w) => `<div style="font:500 11.5px/1.5 'IBM Plex Sans Thai';color:#56655d;margin-top:4px;">• ${esc(w)}</div>`).join('')}
          </div>` : ''}
        ` : `
          <div style="font:500 12px/1.6 'IBM Plex Sans Thai';color:#8a9890;">กดปุ่ม "ขอ AI สรุป" เพื่อให้ AI วิเคราะห์รูปแบบการกินอาหารใน 7 วันที่ผ่านมา และให้คำแนะนำส่วนตัว</div>
        `}
      </div>

      <div style="margin:14px 18px 0;background:linear-gradient(165deg,#fff,#fbfaf5);border:1px solid #efe9da;border-radius:24px;padding:20px;box-shadow:0 18px 40px -34px rgba(27,39,34,.4);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;">แคลอรี 7 วันล่าสุด</div>
          <div style="font:700 11px 'IBM Plex Sans Thai';color:var(--accent);background:var(--accent-soft);padding:5px 10px;border-radius:999px;">เฉลี่ย ${v.weekAvg} kcal/วัน</div>
        </div>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:7px;height:200px;margin-top:14px;">
          ${bigChart}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:14px 18px 0;">
        <div style="background:#fff;border:1px solid #efe9da;border-radius:18px;padding:16px;">
          <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">รวมพลังงาน</div>
          <div style="font:800 22px 'Plus Jakarta Sans';color:#1b2722;margin-top:4px;">${nf(totalKcal)}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;"> kcal</span></div>
        </div>
        <div style="background:#fff;border:1px solid #efe9da;border-radius:18px;padding:16px;">
          <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">จำนวนมื้อ</div>
          <div style="font:800 22px 'Plus Jakarta Sans';color:#1b2722;margin-top:4px;">${totalMeals}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;"> มื้อ</span></div>
        </div>
        <div style="background:#fff;border:1px solid #efe9da;border-radius:18px;padding:16px;">
          <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">วันที่บันทึก</div>
          <div style="font:800 22px 'Plus Jakarta Sans';color:#1b2722;margin-top:4px;">${v.wkCountLogged}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;"> /7</span></div>
        </div>
        <div style="background:#fff;border:1px solid #efe9da;border-radius:18px;padding:16px;">
          <div style="font:600 11px 'IBM Plex Sans Thai';color:#8a9890;">เข้าเป้า</div>
          <div style="font:800 22px 'Plus Jakarta Sans';color:var(--accent);margin-top:4px;">${adherencePct}<span style="font:600 11px 'IBM Plex Sans Thai';color:#a4afa7;"> %</span></div>
        </div>
      </div>

      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:22px;padding:18px;box-shadow:0 12px 28px -28px rgba(27,39,34,.4);">
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:8px;">อาหารที่กินบ่อยวันนี้</div>
        ${topFoodsHtml}
      </div>

      <div style="margin:14px 18px 0;background:linear-gradient(150deg,#1f2b24,#2c3a30);border-radius:24px;padding:20px;color:#fff;">
        <div style="font:700 13px 'IBM Plex Sans Thai';color:#9fe3bf;">📊 สถิติรวม</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;">
          <div>
            <div style="font:800 22px 'Plus Jakarta Sans';">${v.totalScans}</div>
            <div style="font:500 11px 'IBM Plex Sans Thai';color:#aebfb4;margin-top:2px;">ครั้งที่สแกน</div>
          </div>
          <div>
            <div style="font:800 22px 'Plus Jakarta Sans';">🔥 ${v.streak}</div>
            <div style="font:500 11px 'IBM Plex Sans Thai';color:#aebfb4;margin-top:2px;">วันติดต่อกัน</div>
          </div>
        </div>
      </div>

      ${v.allBadges.length > 0 ? `
      <div style="margin:14px 18px 0;background:#fff;border:1px solid #efe9da;border-radius:22px;padding:18px;">
        <div style="font:700 14px 'IBM Plex Sans Thai';color:#1b2722;margin-bottom:12px;">เหรียญรางวัล (${v.earnedBadges.length}/${v.allBadges.length})</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;">
          ${v.allBadges.map((b) => {
            const earned = !!v.badgesEarned[b.id];
            return `<div style="display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:14px;border:1px solid ${earned ? 'rgba(194,87,0,.15)' : '#efe9da'};background:${earned ? 'linear-gradient(135deg,#fff5e6,#ffe8c8)' : '#faf8f1'};opacity:${earned ? 1 : .5};">
              <span style="font-size:20px;flex:none;">${b.icon}</span>
              <span style="font:600 11.5px 'IBM Plex Sans Thai';color:#1b2722;">${esc(b.name)}</span>
            </div>`;
          }).join('')}
        </div>
      </div>` : ''}
    </section>`;
  }

  // ---------- DERIVED VIEW ----------
  function compute() {
    const [accent, accentSoft] = ACCENTS[state.accent] || ACCENTS.green;
    const goal = state.dailyGoal;
    const userName = state.userName;
    const consumed = state.consumed;
    const goalSet = goal > 0;
    const overBy = goalSet ? Math.max(0, consumed - goal) : 0;
    const isOver = overBy > 0;
    const remaining = goalSet ? Math.max(0, goal - consumed) : 0;
    const consumedPct = goalSet ? Math.min(100, Math.round(consumed / goal * 100)) : 0;
    const C = 2 * Math.PI * 84;
    const ringOffset = goalSet ? C * (1 - Math.min(1, consumed / goal)) : C;
    const ringColor = isOver ? '#e85a4f' : accent;

    const h = new Date().getHours();
    const greeting = h < 11 ? 'สวัสดีตอนเช้า ☀' : h < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';

    const macros = [
      { label:'โปรตีน', color:'#4c8dff', v:state.pConsumed, g:120, unit:'g' },
      { label:'คาร์บ',  color:'#f5a524', v:state.cConsumed, g:250, unit:'g' },
      { label:'ไขมัน',  color:'#ff8a5b', v:state.fConsumed, g:65,  unit:'g' },
    ].map((m) => {
      const over = m.v > m.g;
      return { ...m, pct: Math.min(100, Math.round(m.v / m.g * 100)), over, displayColor: over ? '#e85a4f' : m.color };
    });

    const wd = ['อา','จ','อ','พ','พฤ','ศ','ส'];
    const wkDays = [];
    const todayStr = today();
    for (let i = 6; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const ds = dt.toISOString().slice(0, 10);
      const dayLabel = wd[dt.getDay()];
      const isToday = ds === todayStr;
      const histEntry = (state.history || []).find((x) => x.date === ds);
      const val = isToday ? consumed : (histEntry ? histEntry.kcal : 0);
      wkDays.push({ d: dayLabel, val, isToday, date: ds, mealCount: histEntry ? histEntry.meals : (isToday ? state.meals.length : 0) });
    }
    const scaleMax = Math.max(goal, 2300, ...wkDays.map((x) => x.val));
    const week = wkDays.map((w) => ({
      d: w.d,
      h: Math.round(w.val / scaleMax * 100) + '%',
      fill: w.isToday ? accent : '#d3ddd5',
      glow: w.isToday ? '0 6px 14px -6px ' + accent : 'none',
      labelColor: w.isToday ? accent : '#9aa8a0',
      val: w.val,
      mealCount: w.mealCount,
    }));
    const wkTotal = wkDays.reduce((a, x) => a + x.val, 0);
    const wkCountLogged = wkDays.filter((x) => x.val > 0).length;
    const weekAvg = nf(wkCountLogged > 0 ? Math.round(wkTotal / wkCountLogged) : 0);

    const w = state.weight, hcm = state.height;
    const bmi = (w > 0 && hcm > 0) ? +(w / Math.pow(hcm / 100, 2)).toFixed(1) : 0;
    const tdee = w > 0 ? Math.round(w * 33) : 0;
    const body = [
      { v: tdee > 0 ? nf(tdee) : '—',  k: 'TDEE kcal' },
      { v: w    > 0 ? String(w)    : '—', k: 'น้ำหนัก กก.' },
      { v: hcm  > 0 ? String(hcm)  : '—', k: 'ส่วนสูง ซม.' },
      { v: bmi  > 0 ? bmi.toFixed(1) : '—', k: 'BMI' },
    ];
    const bodyGoalLabel = state.bodyGoal || 'ยังไม่ตั้งค่า';

    let bmiAdvice = null;
    if (bmi > 0) {
      if (bmi < 18.5)      bmiAdvice = { label: 'น้ำหนักต่ำกว่าเกณฑ์', level: 'warn', tip: 'ควรปรึกษาแพทย์/นักโภชนาการก่อนตั้งเป้าลดน้ำหนัก' };
      else if (bmi < 23)   bmiAdvice = { label: 'น้ำหนักปกติ',           level: 'ok',   tip: 'อยู่ในเกณฑ์มาตรฐานคนไทย' };
      else if (bmi < 25)   bmiAdvice = { label: 'น้ำหนักเกินเกณฑ์',     level: 'caution', tip: 'ออกกำลังกายและคุมอาหารช่วยลดความเสี่ยง' };
      else if (bmi < 30)   bmiAdvice = { label: 'อ้วนระดับ 1',           level: 'warn', tip: 'ปรึกษาแพทย์เพื่อวางแผนสุขภาพ' };
      else                 bmiAdvice = { label: 'อ้วนระดับ 2 ขึ้นไป',  level: 'warn', tip: 'ปรึกษาแพทย์โดยเร็ว' };
    }

    const modeMeta = {
      food:    { label:'ถ่ายอาหาร',     title:'ถ่ายรูปอาหาร',         hint:'จัดให้อาหารอยู่กลางกรอบ แล้วกดถ่าย' },
      barcode: { label:'บาร์โค้ด',       title:'สแกนบาร์โค้ด',          hint:'เล็งบาร์โค้ดบนบรรจุภัณฑ์ให้อยู่ในกรอบ' },
      label:   { label:'ฉลากโภชนาการ',  title:'สแกนฉลากโภชนาการ',     hint:'ถ่ายตารางโภชนาการให้ชัดและตรง' },
    };
    if (!modeMeta[state.activeMode]) state.activeMode = 'food';
    const modes = ['food','barcode','label'].map((k) => {
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

    const water = state.water || 0;
    const waterPct = Math.min(100, Math.round(water / WATER_GOAL * 100));

    const earnedBadges = BADGE_DEFS.filter((b) => state.badges[b.id]);
    const lockedBadges = BADGE_DEFS.filter((b) => !state.badges[b.id]).slice(0, 3);

    const q = (state.searchQuery || '').toLowerCase().trim();
    const searchResults = q
      ? FOODS.map((f, i) => ({ ...f, idx: i }))
          .filter((f) => f.name.toLowerCase().includes(q) || f.tag.toLowerCase().includes(q))
          .slice(0, 15)
      : FOODS.map((f, i) => ({ ...f, idx: i })).slice(0, 15);

    return {
      accent, accentSoft, userName, initial:userName.charAt(0), greeting, nextAccent,
      remaining: goalSet ? nf(remaining) : '—', goalLabel: goalSet ? nf(goal) : '—', consumedLabel:nf(consumed), consumedPct, ringOffset, ringColor, goalSet, isOver, overByLabel: nf(overBy), bodyGoalLabel, bmiAdvice, bmiValue: bmi,
      macros, week, weekAvg, weekDays:wkDays, wkCountLogged, wkTotal, body, meals:state.meals,
      modes, modeTitle:mm.title, modeHint:mm.hint,
      scanning:state.scanStage === 'analyzing',
      camLive, camHint,
      food:f, resultKcal:nf(resultKcal), confidence:f.confidence, goalSharePct, resultImage:state.resultImage,
      nutrients, servingLabel,
      water, waterPct, waterGoal: WATER_GOAL,
      streak: state.streak || 0,
      totalScans: state.totalScans || 0,
      earnedBadges, lockedBadges, allBadges: BADGE_DEFS, badgesEarned: state.badges,
      searchOpen: state.searchOpen, searchQuery: state.searchQuery, searchResults,
      darkMode: state.darkMode, toast: state.toast,
      user: state.user, syncing: state.syncing,
      recommend: state.recommend, recommendBusy: state.recommendBusy,
      weeklySummary: state.weeklySummary, summaryBusy: state.summaryBusy,
      editOpen: state.editOpen, editFood: state.editFood,
      authOverlayOpen: state.authOverlayOpen,
      draft: state.settingsDraft || { userName, dailyGoal:goal, accent:state.accent, darkMode:state.darkMode },
      navHomeColor:   state.page === 'home'   ? accent : '#9aa8a0',
      navReportColor: state.page === 'report' ? accent : '#9aa8a0',
    };
  }

  function renderToast(v) {
    if (!v.toast) return '';
    const colors = v.toast.kind === 'success' ? { bg:'#1f3d2f', fg:'#9fe3bf' } : { bg:'#1b2722', fg:'#fff' };
    return `
    <div onclick="__ns.dismissToast()" style="position:absolute;left:50%;bottom:100px;transform:translateX(-50%);background:${colors.bg};color:${colors.fg};padding:11px 18px;border-radius:14px;font:600 13px 'IBM Plex Sans Thai';box-shadow:0 14px 28px -10px rgba(0,0,0,.4);z-index:60;animation:ns-pop .35s both;cursor:pointer;max-width:80%;text-align:center;">${esc(v.toast.msg)}</div>`;
  }

  function render() {
    const v = compute();
    v.screenAnim = (lastPage !== state.page);
    lastPage = state.page;
    root.style.setProperty('--accent', v.accent);
    root.style.setProperty('--accent-soft', v.accentSoft);
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    root.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');

    const ae = document.activeElement;
    const focusId = ae && ae.id && root.contains(ae) ? ae.id : null;
    const selStart = focusId && 'selectionStart' in ae ? ae.selectionStart : null;
    const selEnd   = focusId && 'selectionEnd'   in ae ? ae.selectionEnd   : null;

    let screen = '';
    if (state.page === 'home')     screen = renderHome(v);
    if (state.page === 'scan')     screen = renderScan(v);
    if (state.page === 'result')   screen = renderResult(v);
    if (state.page === 'settings') screen = renderSettings(v);
    if (state.page === 'report')   screen = renderReport(v);
    const showNav = state.page !== 'settings';
    root.innerHTML = screen + renderSearchOverlay(v) + renderEditOverlay(v) + renderAuthOverlay(v) + (showNav ? renderNav(v) : '') + renderToast(v);

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

  async function bootSession() {
    const sb = initSupabase();
    if (!sb) return;
    try {
      const { data } = await sb.auth.getSession();
      if (data && data.session && data.session.user) {
        state.user = { id: data.session.user.id, email: data.session.user.email };
        render();
        await pullFromCloud();
      }
      sb.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') { state.user = null; render(); }
      });
    } catch (e) {}
  }
  if (window.supabase) bootSession();
  else window.addEventListener('load', () => setTimeout(bootSession, 500));
})();
