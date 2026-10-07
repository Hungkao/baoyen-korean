const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const ctx={};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['exercise-engine.js','lesson-content.js','lesson-engine.js','platform-engine.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx);
const {LESSON_CONTENT:C,LessonEngine:E,PlatformEngine:P}=ctx;
assert.ok(C.lessons.every(l=>E.status(l.id,E.empty())==='available'));
assert.equal(P.lessonStatus({day:56},{completedDays:[]},'2026-10-06'),'available');
assert.equal(P.lessonStatus({day:56},{completedDays:[{day:1,date:'2026-10-06'}]},'2026-10-06'),'available');
assert.ok(!E.transition(E.empty(),{type:'start',lessonId:'b2-countries-lesson'}).error);
assert.ok(E.transition(E.empty(),{type:'start',lessonId:'unknown'}).error);
(async()=>{
 const b=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
 try{
  const p=await b.newPage({viewport:{width:360,height:820},reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto(pathToFileURL(path.join(__dirname,'../index.html')).href);await p.waitForFunction(()=>tabAccess.writable());
  assert.equal(await p.locator('.legacy-daily').isVisible(),false);
  assert.doesNotMatch(await p.locator('#home').innerText(),/Buổi học hôm nay|Hôm nay em có thể|phút\/ngày/);
  for(const name of ['alphabet','syllables','vocabulary','practice']){
   await p.locator('[data-study='+name+']').click();assert.equal(await p.locator('#'+name).isVisible(),true);
   await p.locator('[data-screen=home]').click();
  }
  await p.locator('[data-study=roadmap]').click();
  assert.equal(await p.locator('.core-lesson[data-status=locked]').count(),0);
  assert.equal(await p.locator('.roadmap-lesson:disabled').count(),0);
  await p.locator('[data-unit=b2-countries] summary').click();await p.locator('[data-lesson=b2-countries-lesson]').click();
  assert.equal(await p.evaluate(()=>state.platform.learning.session.lessonId),'b2-countries-lesson');
  await p.reload();await p.waitForFunction(()=>tabAccess.writable()&&!document.getElementById('lesson').hidden);
  assert.equal(await p.evaluate(()=>state.platform.learning.session.lessonId),'b2-countries-lesson');
  await p.locator('#lesson [data-route=roadmap]').click();
  p.once('dialog',d=>d.dismiss());await p.locator('[data-lesson=h2-a-eo]').click();
  assert.equal(await p.evaluate(()=>state.platform.learning.session.lessonId),'b2-countries-lesson');
  p.once('dialog',d=>d.accept());await p.locator('[data-lesson=h2-a-eo]').click();
  assert.equal(await p.evaluate(()=>state.platform.learning.session.lessonId),'h2-a-eo');
  assert.equal(await p.evaluate(()=>state.completedDays.length),0);
  await p.locator('[data-screen=home]').click();
  for(const theme of ['light','dark']){await p.emulateMedia({colorScheme:theme});for(const screen of ['home','roadmap']){
   await p.evaluate(name=>showScreen(name),screen);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await p.locator('button:visible').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().width>=44&&n.getBoundingClientRect().height>=44)),true);
  }}
  assert.deepEqual(errors,[]);console.log('PASS free learning: choose every section, arbitrary lessons, no locks, resume/switch, 360px themes.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
