const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const ctx={};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['vocabulary-basic.js','vocabulary-intermediate.js','exercise-engine.js','lesson-content.js','lesson-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const C=ctx.LESSON_CONTENT;
assert.equal(C.reference.title,'Sejong Korean 1A (2022)');
const lessons=C.lessons.filter(l=>l.id.startsWith('s1-'));
assert.equal(lessons.length,10);
const words=new Set([...Object.keys(ctx.VOCAB_LEGACY),...ctx.VOCAB_BASIC.map(w=>w.ko),...ctx.VOCAB_INTERMEDIATE.map(w=>w.ko),...ctx.VOCAB_FOUNDATION.map(w=>w.ko)]);
for(const l of lessons){
 assert.equal(ctx.LessonEngine.status(l.id,ctx.LessonEngine.empty()),'available');
 assert.ok(l.memoryCue&&l.recallPrompt&&l.recallAnswer,l.id);
 assert.ok(l.dialogue.length>=2&&l.dialogue.length<=4);
 assert.ok(l.vocabularyIds.length<=8);
 assert.ok(l.vocabularyIds.every(id=>words.has(id.slice(5))),l.id+' missing vocabulary');
 assert.ok(l.grammarIds.every(id=>C.grammar.some(g=>g.id===id)),l.id+' missing grammar');
 assert.ok(l.sections.find(s=>s.type==='QUIZ').exercises.length>=3);
 for(const e of ctx.LessonEngine.exercises(l)){
  const right=e.type==='MATCH'?e.pairs.map(p=>p.right):e.correctAnswer;
  assert.equal(ctx.ExerciseEngine.grade(e,right).correct,true,e.id);
  assert.ok(e.explanation);
 }
 assert.equal(l.contentStatus,'draft');
}
assert.equal(new Set(lessons.map(l=>l.referenceTheme)).size,10);
console.log('PASS Sejong-inspired original content: 10 open scenarios, recall/dialogue, references, vocabulary/grammar and grading.');
