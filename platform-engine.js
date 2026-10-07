'use strict';
// Hàm thuần: không đọc DOM, localStorage hoặc gọi mạng.
window.PlatformEngine = (() => {
 const choices={experience:['new','some','regular'],hangul:['no','some','yes'],goal:['communication','culture','study','work','topik'],topikGoal:['none','1','2','3'],minutes:[10,20,30,45,60],horizonMonths:[3,6,12,18]};
 const empty=()=>({version:1,profile:null,settings:{showRomanization:true},activity:{},events:[],learning:window.LessonEngine?window.LessonEngine.empty():{version:1,session:null,results:{},checkpoints:{}}});
 const dateValid=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 function profile(input){
  if(!input||Object.entries(choices).some(([key,values])=>!values.includes(input[key])))return null;
  const name=typeof input.name==='string'?input.name.normalize('NFC').trim():'';
  if(!name||name.length>60)return null;
  return {name,...Object.fromEntries(Object.keys(choices).map(key=>[key,input[key]])),completedAt:dateValid(input.completedAt)?input.completedAt:null};
 }
 function normalize(input){
  const out=empty();if(!input||typeof input!=='object')return out;
  out.profile=profile(input.profile);out.settings.showRomanization=input.settings?.showRomanization!==false;
  if(input.activity&&typeof input.activity==='object'){
   const dates=Object.keys(input.activity).filter(dateValid).sort().slice(-366);
   for(const date of dates){const value=input.activity[date];if(Number.isInteger(value)&&value>=0&&value<=86400)out.activity[date]=value;}
  }
  if(window.LessonEngine)out.learning=window.LessonEngine.normalize(input.learning);
  if(Array.isArray(input.events))out.events=input.events.slice(-100).filter(e=>e&&['onboarding_completed','settings_updated','lesson_started','lesson_resumed','exercise_answered','lesson_completed','lesson_retried','unit_completed','checkpoint_completed','vocabulary_seen','grammar_seen'].includes(e.type)&&dateValid(e.date)).map(e=>({type:e.type,date:e.date,entityId:typeof e.entityId==='string'?e.entityId.slice(0,64):null}));
  return out;
 }
 function catalog(content,plans){
  return {course:content.course,levels:content.levels,units:content.units,lessons:plans.map(p=>({
   id:'lesson-'+String(p.day).padStart(3,'0'),day:p.day,title:p.title,
   unitId:p.type==='word'?(p.day<=28?'basics-first':'basics-context'):(p.day>=29&&p.day<=32?'hangul-expanded':'hangul-start'),
   content:[{kind:p.type,itemIds:p.items.map(i=>p.type+':'+i.ko)},...(p.grammarId?[{kind:'grammar',itemIds:[p.grammarId]}]:[])],estimatedMinutes:10,
   completion:{kind:'legacy-daily',minimumAnswers:5,minimumCorrect:3}
  }))};
 }
 function snapshot(progress,course,today){
  const completed=new Set(progress.completedDays.map(d=>d.day));
  const currentDay=progress.completedDays.find(d=>d.date===today)?.day||Math.min(course.lessons.length,completed.size+1);
  const lesson=course.lessons.find(l=>l.day===currentDay),unit=course.units.find(u=>u.id===lesson?.unitId),level=course.levels.find(l=>l.id===unit?.levelId);
  const due=Object.entries(progress.srs).filter(([,r])=>r.due<=today).length;
  const platform=normalize(progress.platform),goal=platform.profile?.minutes||10;
  const weekStart=new Date(today+'T12:00:00Z');weekStart.setUTCDate(weekStart.getUTCDate()-((weekStart.getUTCDay()+6)%7));
  const start=weekStart.toISOString().slice(0,10);
  const weekSeconds=Object.entries(platform.activity).filter(([date])=>date>=start&&date<=today).reduce((n,[,s])=>n+s,0);
  return {lesson,unit,level,due,completed:completed.size,wordsSeen:progress.learned.filter(id=>id.startsWith('word:')).length,
   todaySeconds:platform.activity[today]||0,weekSeconds,weekGoalSeconds:goal*60*7,totalSeconds:Object.values(platform.activity).reduce((a,b)=>a+b,0),
   days:new Set([...progress.completedDays.map(d=>d.date),...Object.keys(platform.activity).filter(d=>platform.activity[d]>0)]).size,
   recommendation:due?'review':progress.mistakes.length?'mistakes':'lesson'};
 }
 function lessonStatus(lesson,progress,today){
  if(progress.completedDays.some(d=>d.day===lesson.day))return 'completed';
  return 'available';
 }
 return {choices,empty,profile,normalize,catalog,snapshot,lessonStatus};
})();
