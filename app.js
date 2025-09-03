
const LINKS = {
  "Políticas": "https://corpalloteamentos.sharepoint.com/:f:/s/Corpal/Ej2irJ5cZqVFnucS0ZdM2k4BMUkrfA9-CzDxzu7Y-uPedA?e=vo1JYy&web=1",
  "Manuais": "https://corpalloteamentos.sharepoint.com/:f:/s/Corpal/Etl-sMgvSEJAjILNm91fVWgBcx3to3LOH2LPWuVWqJK03A?e=URQ6LP&web=1",
  "Modelo de documentos": "https://corpalloteamentos.sharepoint.com/:f:/s/Corpal/Ei_klHEBwkBEgEfa73GoqJoBzCaytV0EhqlHj93zm1zRkQ?e=H5PT1g&web=1",
  "BackOffice": "https://corpalloteamentos.sharepoint.com/:f:/s/Corpal/EtlFy9qMJBRFoxii5Gef9WIBbHG1VGix4aUHNI9u-1QMBg?e=qmJkJc&web=1",
  "Engenharia": "https://corpalloteamentos.sharepoint.com/:f:/s/Corpal/EpHxiROLYTpKhHhUCjJG7BUBOGLrkX151PCb3swmoso3Hw?e=wVQnPt&web=1",
  "Negócios": "https://corpalloteamentos.sharepoint.com/:f:/s/Corpal/EiYLWBb8wcdAkeSwNcFpeo4BfKc_v3I-KxLQnmeSoJznXw?e=lWh7oW&web=1",
  "Lista Mestre de Documentos": "https://corpalloteamentos.sharepoint.com/:x:/s/Corpal/ETjTb5nxf21AjgPWFlGBWn0Bfe4KON7Yct3bqBtiYMWxnQ?e=gbqOAR&web=1"
};

const stage = document.getElementById('stage');
const frame = document.getElementById('frame');
const grid = document.getElementById('grid');
const backBtn = document.getElementById('backBtn');

function openSection(name) {
  const url = LINKS[name];
  if (!url) return;

  // Show the iframe stage with the selected section
  frame.src = url;
  stage.style.display = 'block';
  backBtn.classList.remove('hidden');
  // Scroll to stage for better UX
  stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goHome() {
  frame.src = 'about:blank';
  stage.style.display = 'none';
  backBtn.classList.add('hidden');
  window.scrollTo({top:0, behavior:'smooth'});
}

backBtn.addEventListener('click', goHome);

// Keyboard: ESC to go back
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && stage.style.display === 'block') goHome();
});

// Expose to global (for inline onclick handlers if needed)
window.openSection = openSection;
window.goHome = goHome;
