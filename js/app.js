const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes"];
let currentSchedule = DAFS_SCHEDULES[0];
let currentTab = currentSchedule.id;

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

function renderTabs(){
  const el=document.getElementById("scheduleTabs");
  el.innerHTML=DAFS_SCHEDULES.map(s=>`<button class="tab ${s.id===currentTab?"active":""}" onclick="selectSchedule('${s.id}')">${esc(s.name)}</button>`).join("");
}
function selectSchedule(id){
  currentTab=id; currentSchedule=DAFS_SCHEDULES.find(s=>s.id===id)||DAFS_SCHEDULES[0];
  document.getElementById("search").value="";
  document.getElementById("dayFilter").value="";
  renderTabs(); renderSchedule();
}
function renderSchedule(){
  const meta=document.getElementById("scheduleMeta");
  meta.innerHTML=`<strong>${esc(currentSchedule.name)}</strong> · ${esc(currentSchedule.subtitle)} <span style="float:right;color:#8292a5;font-size:11px">${esc(currentSchedule.source)}</span>`;
  if(currentSchedule.type==="nota" || currentSchedule.type==="pendiente"){
    document.getElementById("scheduleContent").innerHTML=`<div class="pending"><strong>Información pendiente</strong><br><br>${currentSchedule.type==="nota"?"El documento contiene una segunda sección idéntica de Mecánica A. No se ha alterado ni eliminado para respetar el archivo fuente.":"Este espacio queda reservado para completar el séptimo horario cuando se proporcione la información."}</div>`;
    return;
  }
  const q=document.getElementById("search").value.toLowerCase().trim();
  const day=document.getElementById("dayFilter").value;
  const chosen=day?[day]:DAYS;
  const html=chosen.map(d=>{
    const entries=(currentSchedule.days[d]||[]).filter(e=>!q || `${e.career} ${e.teacher} ${e.group} ${e.course}`.toLowerCase().includes(q));
    return `<div class="day-card"><div class="day-title">${d}</div>${entries.length?entries.map(e=>`
      <div class="entry">
        <div class="entry-time">${esc(e.time)}</div>
        <div class="entry-career">${esc(e.career)}</div>
        <div class="entry-details">${esc(e.course)}${e.group?` · ${esc(e.group)}`:""}${e.teacher?`<br>Docente: ${esc(e.teacher)}`:""}</div>
      </div>`).join(""):`<div class="empty">Sin registros con este filtro.</div>`}</div>`;
  }).join("");
  document.getElementById("scheduleContent").innerHTML=`<div class="schedule-grid">${html}</div>`;
}
function scrollToSchedules(){document.getElementById("horarios").scrollIntoView({behavior:"smooth"});}
function updateClock(){
  const d=new Date(), t=d.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  document.getElementById("clock").textContent=t;
  const sc=document.getElementById("screenClock"); if(sc) sc.textContent=t;
}
function makeQR(targetId){
  const target=window.location.origin+window.location.pathname;
  const box=document.getElementById(targetId); if(!box)return;
  box.innerHTML="";
  new QRCode(box,{text:target,width:190,height:190,colorDark:"#062d5c",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H});
  if(targetId==="qrcode") document.getElementById("qrUrl").textContent=target;
}
function openScreenMode(){
  const ov=document.getElementById("screenOverlay"); ov.classList.add("active"); ov.setAttribute("aria-hidden","false");
  makeQR("screenQR"); startPromo();
}
function closeScreenMode(){
  document.getElementById("screenOverlay").classList.remove("active");
  document.getElementById("screenOverlay").setAttribute("aria-hidden","true");
}
let promoTimer, promoIndex=0;
const promos=[
  {title:"Laboratorios de Física",subtitle:"Aprender física es experimentar."},
  {title:"Mecánica",subtitle:"Movimiento, fuerzas, energía y medición."},
  {title:"Fluidos y Termodinámica",subtitle:"Experimentación y análisis de fenómenos físicos."},
  {title:"Electricidad y Magnetismo",subtitle:"Comprende los fenómenos que hacen posible la tecnología."},
  {title:"¿Ya tienes tu horario?",subtitle:"Escanea el código QR y consulta la información desde tu celular."}
];
function startPromo(){
  clearInterval(promoTimer);
  const show=()=>{
    const p=promos[promoIndex%promos.length]; promoIndex++;
    document.getElementById("screenTitle").textContent=p.title;
    document.getElementById("screenSubtitle").textContent=p.subtitle;
    document.getElementById("promoTitle").textContent=p.title;
    document.getElementById("promoSubtitle").textContent=p.subtitle;
    document.getElementById("screenPhoto").innerHTML=`<span>${p.title==="¿Ya tienes tu horario?"?"📱":"🔬"}</span><small>${p.title==="¿Ya tienes tu horario?"?"Escanea el QR":"Coloca aquí tus fotos y videos"}</small>`;
  };
  show(); promoTimer=setInterval(show,7000);
}
document.getElementById("search").addEventListener("input",renderSchedule);
document.getElementById("dayFilter").addEventListener("change",renderSchedule);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeScreenMode();});
document.addEventListener("DOMContentLoaded",()=>{
  renderTabs(); renderSchedule(); updateClock(); setInterval(updateClock,1000); makeQR("qrcode");
  if(new URLSearchParams(location.search).get("modo")==="pantalla") openScreenMode();
});
