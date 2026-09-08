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
}


/* =========================================================
   PROMOCIÓN DE LABORATORIOS
   ========================================================= */

let promoTimer = null;
let dafsTimer = null;
let dafsIndex = 0;

const dafsImages = [
  "assets/FotosDAFS/DAFS01.png",
  "assets/FotosDAFS/DAFS02.png",
  "assets/FotosDAFS/DAFS03.png",
  "assets/FotosDAFS/DAFS04.png"
];

function startDAFSCarousel(){

  clearInterval(dafsTimer);

  dafsIndex = 0;

  const image = document.getElementById("dafsSideImage");

  if(!image) return;

  image.src = dafsImages[dafsIndex];

  dafsTimer = setInterval(() => {

    dafsIndex++;

    if(dafsIndex >= dafsImages.length){
      dafsIndex = 0;
    }

    image.classList.remove("dafs-fade");

    /*
      Forzamos que el navegador
      vuelva a ejecutar la animación.
    */
    void image.offsetWidth;

    image.src = dafsImages[dafsIndex];

    image.classList.add("dafs-fade");

  }, 20000);
}

let promoIndex = 0;


/*
   IMPORTANTE:

   Estas son las rutas exactas que utilizaremos
   según tus carpetas de GitHub.
*/

const promos = [

  {
    title:"Laboratorio de Mecánica A",
    subtitle:"Movimiento, fuerzas, energía y experimentación.",
    image:"assets/mecanica-a/mecanicaA_01.png"
  },

  {
    title:"Laboratorio de Mecánica B",
    subtitle:"Experimentación y análisis de fenómenos mecánicos.",
    image:"assets/mecanica-b/mecanicaB_01.png"
  },

  {
    title:"Laboratorio de Electricidad y Magnetismo",
    subtitle:"Experimentación con fenómenos eléctricos y magnéticos.",
    image:"assets/Electricidad/electricidad_01.png"
  },

  {
    title:"Laboratorio de Física General",
    subtitle:"Experimentación de los fundamentos de la física.",
    image:"assets/Fisica-General/fisicaGeneral_01.png"
  },

  {
    title:"Laboratorio de Fluidos y Termodinámica",
    subtitle:"Estudio experimental de fluidos y fenómenos térmicos.",
    image:"assets/Fluidos/fluidos_01.png"
  },

  {
    title:"Laboratorio de Ondas y Óptica",
    subtitle:"Experimentación con ondas, luz y fenómenos ópticos.",
    image:"assets/Optica/Optica_01.png"
  },

  {
    title:"¿Ya tienes tu horario?",
    subtitle:"Escanea el código QR y consulta los horarios desde tu celular.",
    qr:true
  }

];

/* =========================================================
   PROMOCIÓN Y CARRUSEL DE IMÁGENES
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
    subtitle: "17 – 20 de noviembre de 2026 · Facultad de Ciencias de la UNSA",
    image: "assets/eventos/simposio-fisica-2026.png"
  },

  {
    title: "¿Ya tienes tu horario?",
    subtitle: "Escanea el código QR y consulta los horarios desde tu celular.",
    qr: true
  }

];


function showPromo(){

  const p = promos[promoIndex % promos.length];

  promoIndex++;

  /* ==========================================
     ACTUALIZAR TÍTULOS
     ========================================== */

  const screenTitle =
    document.getElementById("screenTitle");

  const screenSubtitle =
    document.getElementById("screenSubtitle");

  const promoTitle =
    document.getElementById("promoTitle");

  const promoSubtitle =
    document.getElementById("promoSubtitle");


  if(screenTitle){
    screenTitle.textContent = p.title;
  }

  if(screenSubtitle){
    screenSubtitle.textContent = p.subtitle;
  }

  if(promoTitle){
    promoTitle.textContent = p.title;
  }

  if(promoSubtitle){
    promoSubtitle.textContent = p.subtitle;
  }


  /* ==========================================
     ZONA DE IMAGEN
     ========================================== */

  const screenPhoto =
    document.getElementById("screenPhoto");

  if(!screenPhoto) return;


  /* ==========================================
     PANTALLA DEL QR
     ========================================== */

  if(p.qr){

    screenPhoto.innerHTML = `
      <div style="
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
      ">

        <span style="font-size:7vw;">📱</span>

        <strong style="
          font-size:clamp(18px,2vw,32px);
          color:white;
          margin-top:15px;
        ">
          ESCANEA EL QR
        </strong>

        <small style="
          font-size:clamp(12px,1.2vw,18px);
          color:#b9cee3;
          margin-top:10px;
        ">
          Consulta los horarios desde tu celular
        </small>

      </div>
    `;

    return;
  }


  /* ==========================================
     MOSTRAR IMAGEN
     ========================================== */

  if(p.image){

    screenPhoto.innerHTML = `
      <img
        src="${p.image}"
        alt="${esc(p.title)}"
        class="screen-promo-image"
      />
    `;

  }

}


/* ==========================================
   INICIAR CARRUSEL
   ========================================== */

function startPromo(){

  clearInterval(promoTimer);

  promoIndex = 0;

  showPromo();

  promoTimer = setInterval(showPromo, 20000);

}




    /* ==========================================
       MOSTRAR FLYER DEL SIMPOSIO
       ========================================== */

    if(p.title==="XXXII Simposio Peruano de Física"){

      screenPhoto.innerHTML=`
        <img
          src="assets/eventos/simposio-fisica-2026.png"
          alt="XXXII Simposio Peruano de Física 2026"
          class="screen-event-image"
        >
      `;

    }else if(p.title==="¿Ya tienes tu horario?"){

      screenPhoto.innerHTML=`
        <span>📱</span>
        <small>Escanea el QR para consultar los horarios</small>
      `;

    }else{

      screenPhoto.innerHTML=`
        <span>🔬</span>
        <small>Conoce nuestros laboratorios de Física</small>
      `;

    }
  };

  show();

  promoTimer=setInterval(show,20000);
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
