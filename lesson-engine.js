'use strict';
// Engine thuần: state machine và chấm điểm độc lập UI/lưu trữ.
window.LessonEngine = (() => {
 const content=window.LESSON_CONTENT,byId=new Map(content.lessons.map(l=>[l.id,l]));
 const get=id=>byId.get(id);
 const exercises=l=>l.sections.flatMap(s=>s.exercises||[]);
 const empty=()=>({version:1,session:null,results:{},checkpoints:{}});
 const iso=v=>typeof v==='string'&&v.length<=30&&Number.isFinite(Date.parse(v));
 const count=(v,max=100000)=>Number.isInteger(v)&&v>=0?Math.min(v,max):0;
 function status(id,data){if(!get(id))return 'planned';return data.results[id]?.completedAt?'completed':'available';}
 function unitProgress(id,data){const u=content.units.find(u=>u.id===id),ids=u?.lessonIds||[];const completed=ids.filter(id=>data.results[id]?.completedAt).length;return {completed,total:ids.length,complete:ids.length>0&&completed===ids.length,checkpoint:u?.checkpointId};}
 function summarize(l,s){
  const all=exercises(l),quiz=l.sections.filter(x=>x.type==='QUIZ').flatMap(x=>x.exercises);
  const correct=all.filter(e=>s.answers[e.id]&&ExerciseEngine.grade(e,s.answers[e.id].value).correct).length;
  const quizCorrect=quiz.filter(e=>s.answers[e.id]&&ExerciseEngine.grade(e,s.answers[e.id].value).correct).length;
  const answered=all.filter(e=>s.answers[e.id]).length,quizAnswered=quiz.filter(e=>s.answers[e.id]).length;
  const accuracy=all.length?Math.round(100*correct/all.length):0,quizAccuracy=quiz.length?Math.round(100*quizCorrect/quiz.length):0;
  const sectionsDone=l.sections.every(section=>s.visited.includes(section.id));
  const ready=sectionsDone&&answered===all.length&&s.quizSubmitted;
  return {correct,incorrect:answered-correct,total:all.length,answered,accuracy,quizCorrect,quizTotal:quiz.length,quizAnswered,quizAccuracy,ready,passed:ready&&quizCorrect*100>=quiz.length*l.completionRules.quizThreshold,seconds:s.seconds,audioFallbacks:all.filter(e=>s.answers[e.id]?.fallback).length,vocabularyIds:l.vocabularyIds,grammarIds:l.grammarIds};
 }
 function normalize(input){
  const out=empty();if(!input||typeof input!=='object')return out;
  for(const l of content.lessons){const r=input.results?.[l.id];if(!r||typeof r!=='object')continue;
   const total=exercises(l).length,qt=l.sections.find(s=>s.type==='QUIZ').exercises.length;
   if(!Number.isInteger(r.correct)||r.correct<0||r.correct>total||!Number.isInteger(r.quizCorrect)||r.quizCorrect<0||r.quizCorrect>qt)continue;
   // Lịch sử hoàn thành chỉ giữ nếu có snapshot đạt đủ evidence của một lần trước.
   const pass=r.pass;
   const passed=pass&&iso(pass.at)&&Number.isInteger(pass.correct)&&pass.correct>=0&&pass.correct<=total&&Number.isInteger(pass.quizCorrect)&&pass.quizCorrect<=qt&&pass.quizCorrect*100>=qt*l.completionRules.quizThreshold;
   out.results[l.id]={attempts:count(r.attempts),correct:r.correct,quizCorrect:r.quizCorrect,total,quizTotal:qt,seconds:count(r.seconds,86400),audioFallbacks:count(r.audioFallbacks,total),xpAwarded:passed?count(r.xpAwarded,total*10):0,completedAt:passed?pass.at:null,pass:passed?{at:pass.at,correct:pass.correct,quizCorrect:pass.quizCorrect}:null,lastAt:iso(r.lastAt)?r.lastAt:null};
   if(l.type==='checkpoint')out.checkpoints[l.id]={quizCorrect:r.quizCorrect,quizTotal:qt,completedAt:out.results[l.id].completedAt,lastAt:out.results[l.id].lastAt};
  }
  const raw=input.session,l=get(raw?.lessonId);
  if(!l||raw.contentVersion!==content.version||!iso(raw.startedAt))return out;
  const visited=Array.isArray(raw.visited)?l.sections.filter(s=>raw.visited.includes(s.id)).map(s=>s.id):[];
  const answers={};for(const e of exercises(l)){const a=raw.answers?.[e.id];if(a&&ExerciseEngine.validAnswer(e,a.value))answers[e.id]={value:JSON.parse(JSON.stringify(a.value)),fallback:e.type==='AUDIO_CHOICE'&&a.fallback===true};}
  let section=count(raw.currentSection,l.sections.length-1);
  // Không cho dữ liệu hỏng nhảy qua phần bắt buộc hoặc câu chưa trả lời.
  for(let i=0;i<section;i++){const s=l.sections[i];if(!visited.includes(s.id)||(s.exercises||[]).some(e=>!answers[e.id])){section=i;break;}}
  const quiz=l.sections.find(s=>s.type==='QUIZ');
  out.session={lessonId:l.id,contentVersion:content.version,currentSection:section,answers,visited,startedAt:raw.startedAt,seconds:count(raw.seconds,86400),attempt:Math.max(1,count(raw.attempt)),quizSubmitted:raw.quizSubmitted===true&&quiz.exercises.every(e=>answers[e.id]),finished:false};
  out.session.finished=raw.finished===true&&summarize(l,out.session).ready;
  // Câu đã đổi ID không biến phiên hoàn tất cũ thành bài dang dở.
  if(raw.finished===true&&!out.session.finished&&out.results[l.id]?.completedAt)out.session=null;
  return out;
 }
 function transition(input,action,now=new Date().toISOString()){
  const data=normalize(input),events=[];let xp=0;
  const fail=reason=>({data,events:[],xp:0,error:reason});
  if(action.type==='start'||action.type==='retry'){
   const l=get(action.lessonId);if(!l)return fail('Không tìm thấy bài học.');
   if(data.session?.lessonId===l.id&&!data.session.finished&&action.type==='start'){events.push({type:'lesson_resumed',entityId:l.id});return {data,events,xp};}
   if(data.session&&!data.session.finished&&data.session.lessonId!==l.id&&!action.replace)return fail('Em còn một bài đang học. Tiếp tục bài đó hoặc xác nhận bắt đầu bài khác.');
   if(action.type==='retry'&&data.session&&!data.session.finished)return fail('Hoàn tất lượt đang học trước khi làm lại.');
   data.session={lessonId:l.id,contentVersion:content.version,currentSection:0,answers:{},visited:[],startedAt:now,seconds:0,attempt:(data.results[l.id]?.attempts||0)+1,quizSubmitted:false,finished:false};events.push({type:action.type==='retry'?'lesson_retried':'lesson_started',entityId:l.id});
   return {data,events,xp};
  }
  const s=data.session,l=get(s?.lessonId);if(!s||!l||s.finished)return fail('Không có bài đang học.');
  const section=l.sections[s.currentSection];
  if(action.type==='back'){
   s.currentSection=Math.max(0,s.currentSection-1);
  }else if(action.type==='answer'){
   const e=section.exercises?.find(e=>e.id===action.exerciseId);if(!e||s.answers[e.id])return fail('Câu này đã trả lời hoặc không thuộc phần đang học.');
   if(!ExerciseEngine.grade(e,action.value).valid)return fail('Em hoàn thành câu trả lời trước nhé.');
   s.answers[e.id]={value:JSON.parse(JSON.stringify(action.value)),fallback:e.type==='AUDIO_CHOICE'&&action.fallback===true};events.push({type:'exercise_answered',entityId:e.id});
  }else if(action.type==='next'){
   if((section.exercises||[]).some(e=>!s.answers[e.id]))return fail('Em trả lời đủ các câu trong phần này nhé.');
   if(section.type==='QUIZ'&&!action.submitQuiz)return fail('Cần nộp bài kiểm tra.');
   if(section.type==='QUIZ')s.quizSubmitted=true;
   if(!s.visited.includes(section.id))s.visited.push(section.id);
   if(section.type==='VOCABULARY')events.push(...l.vocabularyIds.map(entityId=>({type:'vocabulary_seen',entityId})));
   if(section.type==='GRAMMAR')events.push(...l.grammarIds.map(entityId=>({type:'grammar_seen',entityId})));
   if(s.currentSection<l.sections.length-1)s.currentSection++;
   else{
    const result=summarize(l,s);if(!result.ready)return fail('Bài chưa đủ phần bắt buộc.');
    const old=data.results[l.id],firstPass=result.passed&&!old?.completedAt;
    const pass=old?.pass||(result.passed?{at:now,correct:result.correct,quizCorrect:result.quizCorrect}:null);
    const before=unitProgress(l.unitId,data).complete;
    data.results[l.id]={attempts:s.attempt,correct:result.correct,quizCorrect:result.quizCorrect,total:result.total,quizTotal:result.quizTotal,seconds:s.seconds,audioFallbacks:result.audioFallbacks,xpAwarded:firstPass?result.correct*10:0,completedAt:pass?.at||null,pass,lastAt:now};
    if(l.type==='checkpoint')data.checkpoints[l.id]={quizCorrect:result.quizCorrect,quizTotal:result.quizTotal,completedAt:pass?.at||null,lastAt:now};
    s.finished=true;
    if(firstPass){xp=result.correct*10;events.push({type:l.type==='checkpoint'?'checkpoint_completed':'lesson_completed',entityId:l.id});}
    if(!before&&unitProgress(l.unitId,data).complete)events.push({type:'unit_completed',entityId:l.unitId});
   }
  }else return fail('Thao tác không hợp lệ.');
  return {data,events,xp};
 }
 return {get,exercises,empty,normalize,status,unitProgress,summarize,transition};
})();
