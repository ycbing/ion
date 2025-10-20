/*
  app.js
  - 渲染日历网格与星期头
  - 处理按钮与滑动手势
  - 管理 URL ?d=YYYY-MM-DD 深链
  - 控制底部抽屉开合与数据填充
*/
(function () {
  const weekRow = document.getElementById('weekRow');
  const grid = document.getElementById('calendarGrid');
  const monthTitle = document.getElementById('monthTitle');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const todayBtn = document.getElementById('todayBtn');
  const bottomSheet = document.getElementById('bottomSheet');
  const bsTitle = document.getElementById('bsTitle');
  const bsSub = document.getElementById('bsSub');
  const yiList = document.getElementById('yiList');
  const jiList = document.getElementById('jiList');
  const extraSec = document.getElementById('extraSec');
  const hourSec = document.getElementById('hourSec');
  const bsHandle = document.getElementById('bsHandle');

  const WEEK_LABELS = ['一','二','三','四','五','六','日']; // 周一至周日

  function pad(n){ return n < 10 ? '0' + n : '' + n }

  function parseDateParam() {
    const u = new URL(window.location.href);
    const d = u.searchParams.get('d');
    if (!d) return null;
    const m = /^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/.exec(d);
    if (!m) return null;
    const y = +m[1], mm = +m[2]-1, dd = +m[3];
    const dt = new Date(y, mm, dd);
    if (dt.getFullYear() !== y || dt.getMonth() !== mm || dt.getDate() !== dd) return null;
    return dt;
  }

  function setDeepLink(date) {
    const u = new URL(window.location.href);
    u.searchParams.set('d', `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`);
    history.replaceState(null, '', u.toString());
  }

  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let selected = parseDateParam() || today;
  let currentYear = selected.getFullYear();
  let currentMonth = selected.getMonth(); // 0-11

  // 星期头
  function renderWeekHeader() {
    weekRow.innerHTML = '';
    WEEK_LABELS.forEach(l => {
      const d = document.createElement('div');
      d.textContent = l;
      weekRow.appendChild(d);
    });
  }

  // 日历网格
  function renderGrid() {
    const matrix = CalendarService.getMonthMatrix(currentYear, currentMonth + 1);
    monthTitle.textContent = `${currentYear}年${currentMonth + 1}月`;
    grid.innerHTML = '';
    matrix.forEach(row => {
      row.forEach(cell => {
        const div = document.createElement('div');
        div.className = 'cell';
        if (!cell.inCurrentMonth) div.classList.add('other-month');
        if (cell.isToday) div.classList.add('today');
        const isSelected = (cell.date.getTime() === selected.getTime());
        if (isSelected) div.classList.add('selected');

        const solar = document.createElement('div');
        solar.className = 'solar';
        solar.textContent = cell.solarDay;
        div.appendChild(solar);

        const lunar = document.createElement('div');
        lunar.className = 'lunar';
        lunar.textContent = cell.mark || cell.lunarDayName;
        div.appendChild(lunar);

        div.addEventListener('click', () => {
          selected = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate());
          currentYear = cell.date.getFullYear();
          currentMonth = cell.date.getMonth();
          setDeepLink(selected);
          renderGrid();
          openBottomSheet(selected);
        });

        grid.appendChild(div);
      })
    });
  }

  function normalizeDate(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  function openBottomSheet(date){
    const info = CalendarService.getDayHuangli(date);
    const y = date.getFullYear();
    const m = date.getMonth()+1;
    const d = date.getDate();
    const weekMap = ['日','一','二','三','四','五','六'];

    bsTitle.textContent = `${y}-${pad(m)}-${pad(d)}（周${weekMap[date.getDay()]}）`;
    bsSub.textContent = `${info.lunarYearName}${info.lunarMonthName}${info.lunarDayName} · ${info.ganzhiYear}年 ${info.ganzhiMonth}月 ${info.ganzhiDay}日 · 生肖${info.zodiac}`;

    yiList.innerHTML = '';
    jiList.innerHTML = '';
    const yi = (info.yi && info.yi.length) ? info.yi : ['——'];
    const ji = (info.ji && info.ji.length) ? info.ji : ['——'];
    yi.forEach(t => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t; yiList.appendChild(s); });
    ji.forEach(t => { const s = document.createElement('span'); s.className = 'tag bad'; s.textContent = t; jiList.appendChild(s); });

    extraSec.innerHTML = '';
    if (info.chong) {
      const p = document.createElement('div');
      p.textContent = `冲煞：${info.chong}`;
      extraSec.appendChild(p);
    }
    if (info.wuxing) {
      const p = document.createElement('div');
      p.textContent = `五行：${info.wuxing}`;
      extraSec.appendChild(p);
    }
    if (info.jishen || info.xiongshen) {
      const p = document.createElement('div');
      const j = info.jishen ? `吉神：${info.jishen.join('、')}` : '';
      const x = info.xiongshen ? `凶神：${info.xiongshen.join('、')}` : '';
      p.textContent = [j, x].filter(Boolean).join('  ');
      extraSec.appendChild(p);
    }

    hourSec.innerHTML = '';
    if (info.goodHours && info.goodHours.length) {
      const hTitle = document.createElement('h4'); hTitle.textContent = '吉时';
      hourSec.appendChild(hTitle);
      const wrap = document.createElement('div'); wrap.className = 'tag-list';
      info.goodHours.forEach(h => { const s = document.createElement('span'); s.className = 'tag'; s.textContent = h; wrap.appendChild(s); });
      hourSec.appendChild(wrap);
    }

    bottomSheet.classList.add('open');
  }

  function closeBottomSheet(){ bottomSheet.classList.remove('open'); }

  // 手势：切月
  (function bindSwipe(){
    let startX = 0, startY = 0, tracking = false;
    const threshold = 40; // px
    function onStart(e){
      const t = e.touches ? e.touches[0] : e; tracking = true; startX = t.clientX; startY = t.clientY;
    }
    function onMove(e){ if (!tracking) return; }
    function onEnd(e){
      if (!tracking) return; tracking = false; const t = e.changedTouches ? e.changedTouches[0] : e; const dx = t.clientX - startX; const dy = t.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold){
        if (dx < 0) gotoNextMonth(); else gotoPrevMonth();
      }
    }
    grid.addEventListener('touchstart', onStart, {passive:true});
    grid.addEventListener('touchend', onEnd);
    grid.addEventListener('mousedown', onStart);
    window.addEventListener('mouseup', onEnd);
  })();

  // BottomSheet 拖拽收起
  ;(function bindBottomSheetDrag(){
    let startY = 0, startT = 0, dragging = false;
    const header = bsHandle; const el = bottomSheet;
    function getTranslateY(){
      const st = getComputedStyle(el).transform;
      if (st && st !== 'none'){
        const m = st.match(/matrix\(([^)]+)\)/);
        if (m){ const p = m[1].split(',').map(parseFloat); const ty = p.length === 6 ? p[5] : 0; return ty; }
      }
      return 0;
    }
    function onStart(e){ const t = e.touches ? e.touches[0] : e; dragging = true; startY = t.clientY; startT = getTranslateY(); }
    function onMove(e){ if (!dragging) return; const t = e.touches ? e.touches[0] : e; const dy = t.clientY - startY; if (dy > 0){ el.style.transform = `translateY(${dy}px)`; } }
    function onEnd(){ if (!dragging) return; dragging = false; const cur = getTranslateY(); if (cur > 100) closeBottomSheet(); el.style.transform = ''; }
    header.addEventListener('touchstart', onStart, {passive:true});
    header.addEventListener('touchmove', onMove, {passive:true});
    header.addEventListener('touchend', onEnd);
    header.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  })();

  function gotoPrevMonth(){
    const d = new Date(currentYear, currentMonth - 1, 1);
    currentYear = d.getFullYear(); currentMonth = d.getMonth();
    renderGrid();
  }
  function gotoNextMonth(){
    const d = new Date(currentYear, currentMonth + 1, 1);
    currentYear = d.getFullYear(); currentMonth = d.getMonth();
    renderGrid();
  }

  prevBtn.addEventListener('click', gotoPrevMonth);
  nextBtn.addEventListener('click', gotoNextMonth);
  todayBtn.addEventListener('click', () => {
    selected = new Date(); selected = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    currentYear = selected.getFullYear(); currentMonth = selected.getMonth(); setDeepLink(selected); renderGrid(); openBottomSheet(selected);
  });

  // init
  renderWeekHeader();
  renderGrid();
  openBottomSheet(selected);
})();
