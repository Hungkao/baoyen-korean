'use strict';
// Chấm thuần, không DOM. Chỉ bỏ khoảng trắng thừa/dấu kết câu khi bài cho phép.
window.ExerciseEngine = (() => {
 const types=['MULTIPLE_CHOICE','MATCH','ORDER','FILL_BLANK','TYPING','AUDIO_CHOICE','CHARACTER_CHOICE','WORD_MEANING','SENTENCE_CHOICE'];
 const text=(v,e)=>String(v).normalize('NFC').trim().replace(/\s+/g,' ').replace(e.ignorePunctuation?/[.!?。？！]+$/u:/$^/u,'');
 function validAnswer(e,value){
  if(e.type==='MATCH')return Array.isArray(value)&&value.length===e.pairs.length&&value.every(v=>typeof v==='string'&&e.pairs.some(p=>p.right===v));
  if(e.type==='ORDER')return Array.isArray(value)&&value.length===e.tokens.length&&new Set(value).size===value.length&&value.every(v=>Number.isInteger(v)&&v>=0&&v<e.tokens.length);
  if(['TYPING','FILL_BLANK'].includes(e.type))return typeof value==='string'&&value.trim().length>0&&value.length<=200;
  return typeof value==='string'&&e.choices.includes(value);
 }
 function correctAnswer(e){return e.type==='MATCH'?e.pairs.map(p=>p.right):e.type==='ORDER'?e.correctAnswer.map(i=>e.tokens[i]).join(' '):e.correctAnswer;}
 function display(e,value){return Array.isArray(value)?(e.type==='ORDER'?value.map(i=>e.tokens[i]):value).join(' · '):String(value||'');}
 function grade(e,value){
  if(!types.includes(e.type)||!validAnswer(e,value))return {valid:false,correct:false};
  let correct;
  if(e.type==='MATCH')correct=value.every((v,i)=>v===e.pairs[i].right);
  else if(e.type==='ORDER')correct=value.every((v,i)=>v===e.correctAnswer[i]);
  else correct=[e.correctAnswer,...(e.acceptedAnswers||[])].some(a=>text(a,e)===text(value,e));
  return {valid:true,correct,userAnswer:display(e,value),answer:Array.isArray(correctAnswer(e))?correctAnswer(e).join(' · '):correctAnswer(e),explanation:e.explanation};
 }
 return {types,grade,validAnswer,correctAnswer,display};
})();
