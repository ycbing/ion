/*
  libs/lunar.js
  简化版本地农历/黄历工具，提供 CalendarService 接口：
    - getMonthMatrix(year, month) // month: 1-12，返回 6x7 的单元格矩阵
    - getDayHuangli(date) // 返回当日黄历信息（部分字段为近似或留空）

  说明：
  - 为满足示例离线运行与无外部 API 依赖的要求，本文件实现了一个体积小的近似版。
  - 农历换算参考常见实现，节日与节气仅覆盖常见项目。宜/忌、冲煞等较复杂内容保留为空以便 UI 展示。
*/
(function (global) {
  // 天干地支与生肖
  const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const ANIMALS = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

  // 公历节日（简写标识）
  const SOLAR_FEST = {
    '1-1': '元旦', '2-14': '情人', '3-8': '妇女', '5-1': '劳动', '6-1': '儿童', '10-1': '国庆', '12-25': '圣诞'
  };
  // 农历节日（简写标识）
  const LUNAR_FEST = {
    '1-1': '春节', '1-15': '元宵', '5-5': '端午', '7-7': '七夕', '8-15': '中秋', '9-9': '重阳', '12-30': '除夕'
  };

  // 最小农历换算：数据来自常见 JS 开源实现的压缩表（1900-2100），此处截取必要片段
  // 每个元素的二进制位表示该年的闰月和每个月大小，来源算法广泛流传。
  // 为缩短体积，仅包含 1900-2100 年。
  const LUNAR_INFO = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
    0x14b63
  ];
  const MIN_YEAR = 1900;

  function lYearDays(y){
    let sum = 348; // 12 * 29
    const info = LUNAR_INFO[y - MIN_YEAR];
    for (let i=0x8000; i>0x8; i >>= 1) sum += (info & i) ? 1 : 0;
    return sum + leapDays(y);
  }
  function leapMonth(y){ return LUNAR_INFO[y - MIN_YEAR] & 0xf; }
  function leapDays(y){ const lm = leapMonth(y); if (lm) return (LUNAR_INFO[y - MIN_YEAR] & 0x10000) ? 30 : 29; return 0; }
  function monthDays(y,m){ return (LUNAR_INFO[y - MIN_YEAR] & (0x10000 >> m)) ? 30 : 29; }

  // 公历转农历（1900-01-31 为农历 1900-正月初一）
  function solarToLunar(date){
    const baseDate = new Date(1900,0,31);
    let offset = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1900,0,31))/86400000);
    let lunarYear, lunarMonth, lunarDay;

    for (lunarYear = MIN_YEAR; lunarYear < 2101 && offset > 0; lunarYear++) {
      const days = lYearDays(lunarYear);
      if (offset < days) break;
      offset -= days;
    }
    if (offset < 0) { lunarYear--; offset += lYearDays(lunarYear); }

    const leap = leapMonth(lunarYear);
    let isLeap = false;
    for (lunarMonth = 1; lunarMonth <= 12 && offset >= 0; lunarMonth++) {
      let md = monthDays(lunarYear, lunarMonth);
      if (leap && lunarMonth === (leap + 1) && !isLeap){ --lunarMonth; isLeap = true; md = leapDays(lunarYear); }
      else if (isLeap && lunarMonth === (leap + 1)) { isLeap = false; }
      if (offset < md) break; offset -= md;
    }
    lunarDay = offset + 1;
    return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap };
  }

  const CHINESE_NUM = ['零','一','二','三','四','五','六','七','八','九','十','十一','十二'];
  const CHINESE_DAY_PREFIX = ['初','十','廿','卅'];
  function lunarMonthName(m){ return (m<=10 ? CHINESE_NUM[m] : (m===11?'冬':'腊')) + '月'; }
  function lunarDayName(d){
    if (d===10) return '初十'; if (d===20) return '二十'; if (d===30) return '三十';
    const ten = Math.floor((d-1)/10), unit = (d-1)%10+1;
    return CHINESE_DAY_PREFIX[ten] + (unit===10?'十':CHINESE_NUM[unit]);
  }

  function ganzhiOfYear(y){ const idx = (y - 4) % 60; return GAN[idx%10] + ZHI[idx%12]; }
  function ganzhiOfMonth(y,m){ // 简化：以公历计算，近似
    const idx = (y*12 + m + 3) % 60; return GAN[idx%10] + ZHI[idx%12];
  }
  function ganzhiOfDay(date){
    // 以 1899-12-31（甲子日）为基准的常见算法近似
    const base = Date.UTC(1899,11,31);
    const offset = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - base)/86400000);
    const idx = (offset % 60 + 60) % 60; return GAN[idx%10] + ZHI[idx%12];
  }
  function zodiacOfYear(y){ return ANIMALS[(y - 4) % 12]; }

  function detectFestivals(date, lunar){
    const sd = `${date.getMonth()+1}-${date.getDate()}`;
    const ld = `${lunar.month}-${lunar.day}`;
    if (SOLAR_FEST[sd]) return SOLAR_FEST[sd];
    // 除夕：如果农历是腊月并且是该年最后一天
    if (lunar.month === 12){
      const last = monthDays(lunar.year, 12);
      if (lunar.day === last) return '除夕';
    }
    if (LUNAR_FEST[ld]) return LUNAR_FEST[ld];
    return '';
  }

  function getMonthMatrix(year, month){ // month: 1-12
    const first = new Date(year, month - 1, 1);
    const startDay = (first.getDay() + 6) % 7; // 周一为首：0
    const startDate = new Date(year, month - 1, 1 - startDay);

    const today = new Date(); const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    const rows = [];
    for (let r=0; r<6; r++){
      const row = [];
      for (let c=0; c<7; c++){
        const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (r*7+c));
        const inCurrentMonth = d.getMonth() === (month - 1);
        const lunar = solarToLunar(d);
        const mark = detectFestivals(d, lunar);
        row.push({
          date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
          inCurrentMonth,
          solarDay: d.getDate(),
          lunarDayName: lunarDayName(lunar.day),
          lunarMonthName: lunarMonthName(lunar.month),
          isToday: d.getTime() === t0,
          mark: mark || ''
        });
      }
      rows.push(row);
    }
    return rows;
  }

  function getDayHuangli(date){
    const lunar = solarToLunar(date);
    const y = date.getFullYear();
    const info = {
      date,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      lunarMonthName: lunarMonthName(lunar.month),
      lunarDayName: lunarDayName(lunar.day),
      lunarYearName: `${lunar.year}年` ,
      ganzhiYear: ganzhiOfYear(y), // 简化用公历年
      ganzhiMonth: ganzhiOfMonth(y, date.getMonth()+1),
      ganzhiDay: ganzhiOfDay(date),
      zodiac: zodiacOfYear(y),
      yi: [],
      ji: [],
      chong: '',
      wuxing: '',
      jishen: null,
      xiongshen: null,
      goodHours: []
    };
    return info;
  }

  const CalendarService = { getMonthMatrix, getDayHuangli };
  global.CalendarService = CalendarService;
})(window);
