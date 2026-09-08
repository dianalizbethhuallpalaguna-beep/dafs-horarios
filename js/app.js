const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

let currentSchedule = DAFS_SCHEDULES[0];
let currentTab = currentSchedule.id;

function esc(s){
  return String(s || "").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}


/* =========================================================
   HORARIOS
   ========================================================= */

function renderTabs(){
  const el = document.getElementById("scheduleTabs");

  el.innerHTML = DAFS_SCHEDULES.map(s =>
    `<button class="tab ${s.id === currentTab ? "active" : ""}"
      onclick="selectSchedule('${s.id}')">${esc(s.name)}</button>`
  ).join("");
}


function selectSchedule(id){
  currentTab = id;
  currentSchedule =
    DAFS_SCHEDULES.find(s => s.id === id) || DAFS_SCHEDULES[0];

  document.getElementById("search").value = "";
  document.getElementById("dayFilter").value = "";

  renderTabs();
  renderSchedule();
}


function renderSchedule(){

  const meta = document.getElementById("scheduleMeta");

  meta.innerHTML =
    `<strong>${esc(currentSchedule.name)}</strong> ·
    ${esc(currentSchedule.subtitle)}
    <span style="float:right;color:#8292a5;font-size:11px">
    ${esc(currentSchedule.source)}</span>`;

  if(currentSchedule.type === "nota" ||
     currentSchedule.type === "pendiente"){

    document.getElementById("scheduleContent").innerHTML =
      `<div class="pending">
        <strong>Información pendiente</strong>
        <br><br>
        ${
          currentSchedule.type === "nota"
          ?
          "El documento contiene una segunda sección idéntica de Mecánica A. No se ha alterado ni eliminado para respetar el archivo fuente."
          :
          "Este espacio queda reservado para completar el séptimo horario cuando se proporcione la información."
        }
      </div>`;

    return;
  }

  const q =
    document.getElementById("search").value.toLowerCase().trim();

  const day =
    document.getElementById("dayFilter").value;

  const chosen = day ? [day] : DAYS;

  const html = chosen.map(d => {

    const entries =
      (currentSchedule.days[d] || [])
      .filter(e =>
        !q ||
        `${e.career} ${e.teacher} ${e.group} ${e.course}`
        .toLowerCase()
        .includes(q)
      );

    return `
      <div class="day-card">
        <div class="day-title">${d}</div>

        ${
          entries.length

          ?

          entries.map(e => `
            <div class="entry">
              <div class="entry-time">${esc(e.time)}</div>

              <div class="entry-career">
                ${esc(e.career)}
              </div>

              <div class="entry-details">
                ${esc(e.course)}
                ${e.group ? ` · ${esc(e.group)}` : ""}
                ${e.teacher ? `<br>Docente: ${esc(e.teacher)}` : ""}
              </div>
            </div>
          `).join("")

          :

          `<div class="empty">
            Sin registros con este filtro.
          </div>`
        }

      </div>
    `;

  }).join("");

  document.getElementById("scheduleContent").innerHTML =
    `<div class="schedule-grid">${html}</div>`;
}


function scrollToSchedules(){
  document
    .getElementById("horarios")
    .scrollIntoView({behavior:"smooth"});
}


/* =========================================================
   RELOJ
   ========================================================= */

function updateClock(){

  const d = new Date();

  const t =
    d.toLocaleTimeString("es-PE",{
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    });

  document.getElementById("clock").textContent = t;

  const sc =
    document.getElementById("screenClock");

  if(sc){
    sc.textContent = t;
  }
}


/* =========================================================
   QR
   ========================================================= */

function makeQR(targetId){

  const target =
    window.location.origin +
    window.location.pathname;

  const box =
    document.getElementById(targetId);

  if(!box) return;

  box.innerHTML = "";

  new QRCode(box,{
    text:target,
    width:170,
    height:170,
    colorDark:"#062d5c",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.H
  });

  if(targetId === "qrcode"){

    const url =
      document.getElementById("qrUrl");

    if(url){
      url.textContent = target;
    }
  }
}


/* =========================================================
   MODO PANTALLA
   ========================================================= */

function openScreenMode(){

  const ov =
    document.getElementById("screenOverlay");

  ov.classList.add("active");

  ov.setAttribute("aria-hidden","false");

  makeQR("screenQR");

  startPromo();
  
  startDAFSCarousel();
}


function closeScreenMode(){

  document
    .getElementById("screenOverlay")
    .classList.remove("active");

  document
    .getElementById("screenOverlay")
    .setAttribute("aria-hidden","true");

  clearInterval(promoTimer);
  clearInterval(dafsTimer)
}

/* =========================================================
   PROMOCIÓN / CARRUSEL DE PANTALLA
   ========================================================= */

let promoTimer = null;
let promoIndex = 0;

const promos = [

  {
    title: "Laboratorio de Mecánica A",
    subtitle: "Movimiento, fuerzas, energía y experimentación.",
    image: "assets/mecanica-a/mecanicaA_01.png"
  },

  {
    title: "Laboratorio de Mecánica B",
    subtitle: "Experimentación y análisis de fenómenos mecánicos.",
    image: "assets/mecanica-b/mecanicaB_01.png"
  },

  {
    title: "Laboratorio de Electricidad y Magnetismo",
    subtitle: "Experimentación con fenómenos eléctricos y magnéticos.",
    image: "assets/Electricidad/electricidad_01.png"
  },

  {
    title: "Laboratorio de Física General",
    subtitle: "Experimentación de los fundamentos de la física.",
    image: "assets/Fisica-General/fisicaGeneral_01.png"
  },

  {
    title: "Laboratorio de Fluidos y Termodinámica",
    subtitle: "Estudio experimental de fluidos y fenómenos térmicos.",
    image: "assets/Fluidos/fluidos_01.png"
  },

  {
    title: "Laboratorio de Ondas y Óptica",
    subtitle: "Experimentación con ondas, luz y fenómenos ópticos.",
    image: "assets/Optica/Optica_01.png"
  },

  {
    title: "XXXII Simposio Peruano de Física",
    subtitle: "17–20 de noviembre de 2026 · Facultad de Ciencias de la UNSA",
    image: "assets/eventos/simposio-fisica-2026.png"
  },

  {
    title: "¿Ya tienes tu horario?",
    subtitle: "Escanea el código QR y consulta los horarios desde tu celular.",
    qr: true
  }

];


function startPromo(){

  clearInterval(promoTimer);

  promoIndex = 0;

  const show = () => {

    const p = promos[promoIndex % promos.length];

    promoIndex++;

    const title =
      document.getElementById("screenTitle");

    const subtitle =
      document.getElementById("screenSubtitle");

    const photo =
      document.getElementById("screenPhoto");

    if(!title || !subtitle || !photo){
      return;
    }


    /* TEXTO */

    title.textContent = p.title;
    subtitle.textContent = p.subtitle;


    /* QR */

    if(p.qr){

      photo.innerHTML = `
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          height:100%;
          width:100%;
        ">

          <span style="font-size:7vw;">
            📱
          </span>

          <strong style="
            font-size:clamp(22px,2.5vw,40px);
            color:white;
            margin-top:15px;
          ">
            ESCANEA EL QR
          </strong>

          <small style="
            font-size:clamp(13px,1.2vw,20px);
            color:#b9cee3;
            margin-top:10px;
          ">
            Consulta los horarios desde tu celular
          </small>

        </div>
      `;

      makeQR("screenQR");

      return;
    }


    /* IMAGEN */

    photo.innerHTML = `
      <img
        src="${p.image}"
        alt="${esc(p.title)}"
        class="screen-promo-image"
      >
    `;

  };


  show();

  /* CAMBIO CADA 20 SEGUNDOS */

  promoTimer = setInterval(show, 20000);

}
/* =========================================================
   EVENTOS
   ========================================================= */

document
  .getElementById("search")
  .addEventListener("input",renderSchedule);


document
  .getElementById("dayFilter")
  .addEventListener("change",renderSchedule);


document.addEventListener("keydown",e=>{

  if(e.key === "Escape"){
    closeScreenMode();
  }

});


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded",()=>{

  renderTabs();

  renderSchedule();

  updateClock();

  setInterval(updateClock,1000);

  makeQR("qrcode");


  /*
     Si se abre la página con:

     ?modo=pantalla

     entra automáticamente al modo pantalla.
  */

  if(
    new URLSearchParams(location.search).get("modo")
    ===
    "pantalla"
  ){

    openScreenMode();

  }

});
