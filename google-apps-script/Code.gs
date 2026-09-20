const SHEET_NAME = 'Respostas';

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'submit') return json_(saveResponse_(body));
    if (body.action === 'list') return json_(listResponses_(body));
    throw new Error('Ação inválida.');
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Erro interno.' });
  }
}

function saveResponse_(body) {
  const members = {
    '3026102010':'Guilherme Ferreira Bento','3026101895':'Gabriel de Sousa Borges',
    '3026102533':'Gustavo Pereira Furlan','3126103267':'Jorge Henrique do Nascimento',
    '3026100339':'Luca Maciel da Silva do Nascimento','3026105428':'André Richard Rios Escobar',
    '3026101687':'Guilherme Manoel de Lima','3026104873':'Isaac Batista de Melo',
    '3126103464':'Kayke Lira Moreira','3025103571':'Murilo Akio Ribeiro Kota'
  };
  const ra = String(body.ra || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  if (!members[ra]) throw new Error('Integrante não reconhecido.');
  if (!/^[a-z0-9._%+\-]+@uni9\.edu\.br$/i.test(email)) throw new Error('Informe um e-mail educacional terminado em @uni9.edu.br.');
  if (!Array.isArray(body.answers) || body.answers.length !== 12 || !body.answers.every((answer,index) => answer && answer.questionId === 'Q' + String(index+1).padStart(2,'0') && Number.isInteger(answer.option) && answer.option >= 0 && answer.option <= 3)) throw new Error('Resposta incompleta ou inválida.');
  if (!body.scores || typeof body.scores !== 'object') throw new Error('Pontuação ausente.');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    const row = [new Date(),safe_(body.formVersion,20),members[ra],ra,number_(body.weeklyHours,0,40),safe_(body.bestWindow,80),safe_(body.meetingMode,80),safe_(body.constraints,500),JSON.stringify(body.skills||{}),safe_(body.preferred,10),safe_(body.avoid,10),safe_(body.evidence,700),number_(body.confidence,1,4),safe_(body.challenge,180),number_(body.durationSeconds,0,7200),JSON.stringify(body.answers),JSON.stringify(scores_(body.scores)),email];
    const existing = values.findIndex((r,i)=>i>0 && String(r[3])===ra);
    if (existing>0) sheet.getRange(existing+1,1,1,row.length).setValues([row]);
    else sheet.appendRow(row);
    return {ok:true,updated:existing>0};
  } finally { lock.releaseLock(); }
}

function listResponses_(body) {
  const expected = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!expected) throw new Error('ADMIN_PASSWORD ainda não foi configurada no Apps Script.');
  if (String(body.adminPassword||'') !== expected) throw new Error('Senha administrativa incorreta.');
  const values = getSheet_().getDataRange().getValues();
  const rows = values.slice(1).filter(r=>r[3]).map(r=>({submittedAt:r[0],formVersion:r[1],name:r[2],ra:String(r[3]),weeklyHours:r[4],bestWindow:r[5],meetingMode:r[6],constraints:r[7],skills:parse_(r[8],{}),preferred:r[9],avoid:r[10],evidence:r[11],confidence:r[12],challenge:r[13],durationSeconds:r[14],answers:parse_(r[15],[]),scores:parse_(r[16],{}),email:r[17]||''}));
  return {ok:true,rows:rows};
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  const headers = ['Enviado em','Versão','Nome','RA','Horas/semana','Melhor período','Reunião','Limitações','Habilidades','Preferência','Evitar','Evidência','Confiança','Desafio','Duração (s)','Respostas','Pontuações','E-mail educacional'];
  if (sheet.getLastRow()===0) { sheet.appendRow(headers); sheet.setFrozenRows(1); sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#087f5b').setFontColor('#ffffff'); }
  else if (sheet.getRange(1,18).getValue() !== headers[17]) { sheet.getRange(1,18).setValue(headers[17]).setFontWeight('bold').setBackground('#087f5b').setFontColor('#ffffff'); }
  return sheet;
}

function safe_(value,max) {
  const text = String(value||'').trim().slice(0,max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function number_(value,min,max) { const n=Number(value); if (!Number.isFinite(n)) return min; return Math.max(min,Math.min(max,n)); }
function parse_(value,fallback) { try { return JSON.parse(value||''); } catch (_) { return fallback; } }
function scores_(value) {
  const allowed = ['DOC','REQ','UI','FE','FEO','MAP','AUTH','OCC','DB','QA'];
  const result = {};
  allowed.forEach(id => result[id] = number_(value && value[id],0,100));
  return result;
}
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
