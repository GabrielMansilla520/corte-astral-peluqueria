// Data
const cuts = [
  {
    id: 1,
    name: "Corte Clásico",
    description: "Un corte atemporal que nunca pasa de moda",
    price: "25€",
    image: "https://doloritta.com/images2/corte-de-pelo-clasico/corte-de-pelo-clasico-99_8.jpg"
  },
  {
    id: 2,
    name: "Degradado Moderno",
    description: "Estilo urbano con transiciones suaves",
    price: "30€",
    image: "https://cortesdepelohombres.com/wp-content/uploads/2021/10/28.-Low-fade-con-desvanecido-y-parte-trasera-en-punta-y-diseno-razor.jpg"
  },
  {
    id: 3,
    name: "Texturizado",
    description: "Corte con movimiento y volumen",
    price: "35€",
    image: "https://st4allthings4p4ci.blob.core.windows.net/allthingshair/allthingshair/wp-content/uploads/sites/13/2023/03/14002720/corte-texturizado-10-756x1024.jpg"
  },
  {
    id: 4,
    name: "Undercut Moderno",
    description: "Estilo audaz y contemporáneo",
    price: "40€",
    image: "https://tahecosmetics.com/trends/wp-content/uploads/2023/02/undercut-raya-lateral.jpg"
  },
  {
    id: 5,
    name: "Pompadour",
    description: "Clásico renovado con estilo actual",
    price: "35€",
    image: "https://i0.wp.com/hairinmotion.co.uk/wp-content/uploads/2022/10/Corte-masculino-estilo-Pompadour-o-Tupe.jpg"
  },
  {
    id: 6,
    name: "Corte Ejecutivo",
    description: "Elegancia y profesionalismo",
    price: "30€",
    image: "https://blog.newoldman.com.br/wp-content/uploads/2020/08/Corte-de-cabelo-masculino-social-Slick-Back-2.jpg"
  }
];

const gallery = [
  "https://static.desygner.com/wp-content/uploads/sites/11/2018/10/15170448/blog_4_original-1-1024x665.jpg",
  "https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/11/13170253/PARA-TI-PELUQUERIAS-estudio-H-1-news-MV-20181116.jpg",
  "https://media.istockphoto.com/id/640274128/es/foto/barbero-usando-tijeras-y-peine.jpg?s=612x612&w=0&k=20&c=auAw5KKIYSD9QTcztggDPHOHnY68bRtgHnGCslTlmcs=",
  "https://resizer.glanacion.com/resizer/v2/este-estudio-es-la-cuna-de-casi-todas-las-NZLRMANOCBFZBL6AKZSVUS4FMY.jpg?auth=3cc84f6f0c665e2f87276315e74558c0335619d30dcb46687fbe00cf94a8e4fe&width=420&height=280&quality=70&smart=true"
];

// Elementos DOM
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modal = document.getElementById('cutModal');
const modalClose = document.querySelector('.modal-close');
const cutsGrid = document.querySelector('.cuts-grid');
const galleryGrid = document.querySelector('.gallery-grid');

// Abrir menú
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Modal de Administración/Manejo
function openModal(cut) {
  const cutModal = document.getElementById('cutModal');
  const modalImage = cutModal.querySelector('.modal-image');
  const modalTitle = cutModal.querySelector('h3');
  const modalDescription = cutModal.querySelector('.description');
  const modalPrice = cutModal.querySelector('.price');
  const modalContent = cutModal.querySelector('.modal-content');

  // Animaciones del Modal
  modalContent.style.opacity = '0';
  modalContent.style.transform = 'translateY(20px)';
  
  cutModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  modalImage.innerHTML = `
    <img src="${cut.image}" 
         alt="${cut.name}"
         loading="lazy"
         class="hover-lift">
  `;
  modalTitle.textContent = cut.name;
  modalDescription.textContent = cut.description;
  modalPrice.textContent = cut.price;


//Envío en WPP
const modalReservaBtn = cutModal.querySelector('.btn-reserva');
modalReservaBtn.addEventListener('click', () => {
  const phoneNumber = "+543774447612"; // Número
  const message = `Hola, quiero reservar un ${cut.name} (${cut.price}).`; //Mensaje
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`; //URL que se generará
  window.open(whatsappURL, "_blank"); //Se abre en otra pestaña.
});





  // Trigger animations after content is set
  requestAnimationFrame(() => {
    modalContent.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    modalContent.style.opacity = '1';
    modalContent.style.transform = 'translateY(0)';
  });
}

function closeModal(modalElement) {
  modalElement.classList.remove('active');
  
  // Only reset body overflow if no other modals are active
  const activeModals = document.querySelectorAll('.modal.active');
  if (activeModals.length === 0) {
    document.body.style.overflow = 'auto';
  }
}

function renderCuts(limit = 3) {
  cutsGrid.innerHTML = '';
  
  const cutsToShow = limit ? cuts.slice(0, limit) : cuts;
  
  cutsToShow.forEach((cut, index) => {
    const cutCard = document.createElement('div');
    cutCard.className = 'cut-card';
    cutCard.style.animationDelay = `${index * 0.2}s`;
    
    cutCard.innerHTML = `
      <div class="cut-image-container">
        <img src="${cut.image}" 
             alt="${cut.name}"
             loading="lazy">
      </div>
      <div class="cut-info">
        <h3>${cut.name}</h3>
        <p class="cut-price">${cut.price}</p>
        <button class="btn-reserva gradient-bg scale-effect">
          <i class="fas fa-calendar-check"></i> Reservar
        </button>
      </div>
    `;
    
    const reservaBtn = cutCard.querySelector('.btn-reserva');
    reservaBtn.addEventListener('click', () => openModal(cut));
    
    cutsGrid.appendChild(cutCard);
  });

  if (limit && cuts.length > limit) {
    const verMasContainer = document.createElement('div');
    verMasContainer.className = 'ver-mas-container';
    verMasContainer.innerHTML = `
      <button class="btn-ver-mas-horizontal gradient-bg scale-effect">
        <i class="fas fa-plus-circle"></i> Ver más cortes
      </button>
    `;
    
    verMasContainer.querySelector('.btn-ver-mas-horizontal').addEventListener('click', () => {
      const allCutsModal = document.getElementById('allCutsModal');
      renderAllCuts();
      allCutsModal.classList.add('active');
    });
    
    cutsGrid.parentElement.appendChild(verMasContainer);
  }
}

function renderAllCuts() {
  const allCutsGrid = document.querySelector('.all-cuts-grid');
  allCutsGrid.innerHTML = '';
  
  cuts.forEach((cut, index) => {
    const cutCard = document.createElement('div');
    cutCard.className = 'cut-card';
    cutCard.style.animationDelay = `${index * 0.1}s`;
    
    cutCard.innerHTML = `
      <div class="cut-image-container">
        <img src="${cut.image}" 
             alt="${cut.name}"
             loading="lazy">
      </div>
      <div class="cut-info">
        <h3>${cut.name}</h3>
        <p class="cut-description">${cut.description}</p>
        <p class="cut-price">${cut.price}</p>
        <button class="btn-reserva gradient-bg scale-effect">
          <i class="fas fa-calendar-check"></i> Reservar
        </button>
      </div>
    `;
    
    const reservaBtn = cutCard.querySelector('.btn-reserva');
    reservaBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      openModal(cut);
    });
    
    allCutsGrid.appendChild(cutCard);
  });
}

function renderGallery() {
  gallery.forEach((image, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item slide-in-bottom';
    galleryItem.style.animationDelay = `${index * 0.1}s`;
    galleryItem.innerHTML = `<img src="${image}" alt="Galería">`;
    galleryGrid?.appendChild(galleryItem);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target?.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  alert('Mensaje enviado correctamente');
  contactForm.reset();
});

const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = item.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    item.style.transform = `
      perspective(1000px)
      rotateY(${(x - 0.5) * 10}deg)
      rotateX(${(y - 0.5) * -10}deg)
      translateZ(20px)
    `;
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'none';
  });
});

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  const scrolled = window.pageYOffset;
  hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

document.querySelectorAll('.btn-reserva').forEach(button => {
  button.addEventListener('mouseenter', (e) => {
    const x = e.clientX - button.getBoundingClientRect().left;
    const y = e.clientY - button.getBoundingClientRect().top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
  });
});

import { Auth } from './admin/auth.js';
import { Scheduler } from './admin/scheduler.js';

const auth = new Auth();
const scheduler = new Scheduler();



const adminSchedule = {
  appointments: []
};

window.validateLogin = async function() {
  const password = document.getElementById('adminPassword').value;
  const loginModal = document.getElementById('loginModal');
  
  if (await auth.login(password)) {
    loginModal.classList.remove('active');
    openScheduleModal();
  }
};

window.openLoginModal = function() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.add('active');
};

window.openScheduleModal = function() {
  const scheduleModal = document.getElementById('scheduleModal');
  scheduleModal.classList.add('active');
  renderSchedule();
};

window.addAppointment = function(button) {
  const cell = button.parentElement;
  const day = cell.dataset.day;
  const time = cell.dataset.time;
  
  const client = prompt('Nombre del cliente:');
  if (client) {
    adminSchedule.appointments.push({ day, time, client });
    renderSchedule();
  }
};

window.removeAppointment = function(day, time) {
  const index = adminSchedule.appointments.findIndex(
    app => app.day === day && app.time === time
  );
  
  if (index !== -1) {
    adminSchedule.appointments.splice(index, 1);
    renderSchedule();
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCuts(3); // Show only 3 cuts initially
  renderGallery();
  animateOnScroll();

  // Setup enhanced modal close handlers
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      const modalToClose = this.closest('.modal');
      closeModal(modalToClose);
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
   });
  });

  // Handle ESC key to close modals in proper order
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = Array.from(document.querySelectorAll('.modal.active'));
     if (activeModals.length > 0) {
     // Close the last opened modal
   closeModal(activeModals[activeModals.length - 1]);
      }
    }
  });

  const loginBtn = document.querySelector('.nav-links .btn-reserva');
  if (loginBtn) {
    loginBtn.addEventListener('click', window.openLoginModal);
  }
});




function renderSchedule() {
  const scheduleBody = document.querySelector('.schedule-body');
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const hours = [];
  
  // Generate hours from 9:00 to 20:00
  for (let i = 9; i <= 20; i++) {
    hours.push(`${i}:00`);
  }

  scheduleBody.innerHTML = '';

  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>Hora</th>' + days.map(day => `<th>${day}</th>`).join('');
  scheduleBody.appendChild(headerRow);

  hours.forEach(hour => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${hour}</td>` + days.map(day => {
      const appointment = adminSchedule.appointments.find(
        app => app.day === day && app.time === hour
      );
      
      return `
        <td class="schedule-cell" data-day="${day}" data-time="${hour}">
          ${appointment ? 
            `<div class="appointment">
               <span>${appointment.client}</span>
               <button onclick="removeAppointment('${day}', '${hour}')" class="remove-appointment">×</button>
             </div>` 
            : '<button onclick="addAppointment(this)" class="add-appointment">+</button>'
          }
        </td>
      `;
    }).join('');
    
    scheduleBody.appendChild(row);
  });
}
