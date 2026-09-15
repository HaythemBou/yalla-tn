/**
 * يلّا — the record sheet and the numbers behind the dashboard.
 *
 * Every visitor who makes a seal gets a number. Every thing they do on the
 * landing page (seal, day, poster, word for the team, email, completion)
 * is posted here and lands as one row in a Google Sheet, so at launch you
 * can sort supporters by how far they went and by their number.
 *
 * Setup (about three minutes):
 *   1. Create a Google Sheet. Name the first tab "records".
 *   2. Extensions → Apps Script. Delete what is there, paste this file, save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me.   Who has access: Anyone.
 *      Copy the web app URL (ends with /exec).
 *   4. In app.js, set  CONFIG.recordEndpoint = 'https://script.google.com/macros/s/…/exec'
 *      and push. Open dash.html on the site and paste the same URL there.
 *
 * Columns: at · kind · no · name · gov · deleg · lang · steps · effect ·
 *          answers · word · email · what · seed · ua
 */
var HEADERS = ['at','kind','no','name','gov','deleg','lang','steps','effect','answers','word','email','what','seed','ua'];
/* GET ?wipe=<WIPE_KEY> empties the sheet (the header stays). Keep the key private. */
var WIPE_KEY = '6ea1d2dc5e008232';

function sheet_(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('records') || ss.insertSheet('records');
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}
function out_(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e){
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var row = HEADERS.map(function(k){ var v = body[k]; return v === undefined || v === null ? '' : String(v).slice(0, 1000); });
    sheet_().appendRow(row);
    return out_({ ok: true });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
}

/* GET ?stats=1  → everything the dashboard shows (add &since=ISO to count only rows from that moment).  GET alone → a health check.  GET ?wipe=KEY → empties the sheet. */
function doGet(e){
  var sh = sheet_(); var p = (e && e.parameter) || {};
  if (p.wipe){ if (p.wipe !== WIPE_KEY) return out_({ ok: false, error: 'wrong key' }); var n = sh.getLastRow() - 1; if (n > 0) sh.deleteRows(2, n); return out_({ ok: true, wiped: n }); }
  var rows = sh.getDataRange().getValues(); var idx = {}; HEADERS.forEach(function(k, i){ idx[k] = i; });
  if (p.since){ var since = String(p.since); rows = [rows[0]].concat(rows.slice(1).filter(function(r){ return String(r[idx.at] || '') >= since; })); }
  if (!p.stats) return out_({ ok: true, rows: rows.length - 1, since: p.since || null });
  var byKind = {}, byGov = {}, byDeleg = {}, byLang = {}, byDay = {}, byHour = {}, byDevice = {}, effects = {}, people = {}, words = [], emails = {}, steps = {}, answers = {}, whats = {};
  for (var i = 1; i < rows.length; i++){
    var r = rows[i]; var kind = r[idx.kind], no = String(r[idx.no] || ''), gov = r[idx.gov] || '', lang = r[idx.lang] || '', at = String(r[idx.at] || '').slice(0, 10);
    byKind[kind] = (byKind[kind] || 0) + 1; if (lang) byLang[lang] = (byLang[lang] || 0) + 1; if (at) byDay[at] = (byDay[at] || 0) + 1;
    if (kind === 'seal'){
      var hr = String(r[idx.at] || '').slice(11, 13); if (hr) byHour[hr] = (byHour[hr] || 0) + 1;
      var ua = String(r[idx.ua] || ''); var dev = /iPhone|iPad/.test(ua) ? 'iPhone' : /Android/.test(ua) ? 'Android' : /Mobile/.test(ua) ? 'Other mobile' : 'Desktop'; byDevice[dev] = (byDevice[dev] || 0) + 1; }
    if (kind === 'day' && r[idx.effect] !== ''){ var ef = String(r[idx.effect]); effects[ef] = (effects[ef] || 0) + 1; }
    if (no){ var p = people[no] || (people[no] = { no: no, name: '', gov: '', deleg: '', lang: '', kinds: {}, steps: '', effect: '', first: at, last: at, email: '' });
      p.kinds[kind] = true; if (r[idx.name]) p.name = r[idx.name]; if (gov) p.gov = gov; if (r[idx.deleg]) p.deleg = r[idx.deleg]; if (lang) p.lang = lang;
      if (String(r[idx.steps] || '').length > p.steps.length) p.steps = String(r[idx.steps]); if (r[idx.effect] !== '') p.effect = r[idx.effect]; if (r[idx.email]) p.email = r[idx.email]; if (at > p.last) p.last = at; if (at < p.first) p.first = at; }
    if (kind === 'word' && r[idx.word]) words.push({ at: at, no: no, name: r[idx.name], gov: gov, word: String(r[idx.word]).slice(0, 600) });
    if (r[idx.email]) emails[String(r[idx.email]).toLowerCase()] = true;
    String(r[idx.steps] || '').split('|').forEach(function(st){ if (st) steps[st] = (steps[st] || 0) + 1; });
    if (kind === 'day') String(r[idx.answers] || '').split('|').forEach(function(a){ if (a) answers[a] = (answers[a] || 0) + 1; });
    if (kind === 'card' && r[idx.what]) whats[r[idx.what]] = (whats[r[idx.what]] || 0) + 1;
  }
  Object.keys(people).forEach(function(k){ var p = people[k]; if (p.gov) byGov[p.gov] = (byGov[p.gov] || 0) + 1; if (p.gov && p.deleg) byDeleg[p.gov + ' · ' + p.deleg] = (byDeleg[p.gov + ' · ' + p.deleg] || 0) + 1; });
  var list = Object.keys(people).map(function(k){ var p = people[k]; p.done = Object.keys(p.kinds).length; p.completed = !!p.kinds.complete; p.kinds = Object.keys(p.kinds).join('|'); return p; })
    .sort(function(a, b){ return (b.completed - a.completed) || (b.done - a.done) || (Number(a.no) - Number(b.no)); });
  return out_({ ok: true, rows: rows.length - 1, since: p.since || null, byKind: byKind, byGov: byGov, byDeleg: byDeleg, byLang: byLang, byDay: byDay, byHour: byHour, byDevice: byDevice, effects: effects, steps: steps, answers: answers, whats: whats,
    people: list.slice(0, 3000), words: words.slice(-200).reverse(), emails: Object.keys(emails).length, completed: list.filter(function(p){ return p.completed; }).length });
}
