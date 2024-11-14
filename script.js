// Define los usuarios y contraseñas permitidos
const validUsers = [
    { username: "JoelGuthrie", password: "1234" },
    { username: "Belford", password: "8475" }
];

const editableUsers = ["JoelGuthrie", "Belford"];

// Elementos del DOM
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const loginModal = document.getElementById("loginModal");
const userInfo = document.getElementById("userInfo");
const welcomeMessage = document.getElementById("welcomeMessage");
const userAvatar = document.getElementById("userAvatar");
const errorMessage = document.getElementById("errorMessage");
const mobileMenuIcon = document.getElementById("mobile-menu");
const navLinks = document.getElementById("nav-links");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const prayerForm = document.getElementById("prayerForm");

// Inicialización de AOS
AOS.init({
    duration: 1000,
    once: true,
});

// Manejo del scroll para el header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(34, 35, 35, 0.9)';
        header.style.padding = '0.5rem 0';
    } else {
        header.style.backgroundColor = '#222323';
        header.style.padding = '1rem 0';
    }
});

// Manejo del menú móvil
mobileMenuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Cerrar menú móvil al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Manejo del inicio de sesión
loginButton.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = validUsers.find(u => u.username === username && u.password === password);

    if (user) {
        loginModal.style.display = "none";
        loginButton.style.display = "none";
        userInfo.style.display = "flex";
        welcomeMessage.textContent = `Bienvenido, ${username}`;
        userAvatar.src = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;
        userInfo.classList.add("welcome-animation");

        // Mostrar botones de edición si el usuario tiene permisos
        if (editableUsers.includes(username)) {
            document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'inline-block');
        }
    } else {
        errorMessage.style.display = "block";
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});

logoutButton.addEventListener("click", () => {
    loginButton.style.display = "block";
    userInfo.style.display = "none";
    document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'none');
});

// Cerrar el modal de login si se hace clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Manejo de la búsqueda
const sections = Array.from(document.querySelectorAll('section')).map(section => ({
    id: section.id,
    content: section.textContent,
    element: section
}));

const fuseOptions = {
    includeScore: true,
    threshold: 0.4,
    keys: ['content']
};

const fuse = new Fuse(sections, fuseOptions);

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        alert("Por favor, ingrese un término de búsqueda.");
        return;
    }

    const results = fuse.search(searchTerm);
    
    if (results.length > 0) {
        const bestMatch = results[0].item;
        bestMatch.element.scrollIntoView({ behavior: 'smooth' });
        
        bestMatch.element.style.transition = 'background-color 0.3s';
        bestMatch.element.style.backgroundColor = 'rgba(180, 128, 79, 0.1)';
        setTimeout(() => {
            bestMatch.element.style.backgroundColor = '';
        }, 1500);
    } else {
        alert("No se encontraron resultados para la búsqueda.");
    }
    
    searchInput.value = '';
}

// Manejo del carrusel de anuncios
const carousel = document.querySelector('.carousel-inner');
const items = carousel.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
let currentIndex = 0;

function showSlide(index) {
    carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Iniciar el carrusel desde el primer elemento
showSlide(0);

// Cambiar slide automáticamente cada 5 segundos
setInterval(nextSlide, 5000);

// Manejo del formulario de oración
prayerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("prayerName").value;
    const request = document.getElementById("prayerRequest").value;
    const email = "eliasjoelferrierguthrie@gmail.com";
    const subject = encodeURIComponent("Nueva Petición de Oración");
    const body = encodeURIComponent(`Nombre: ${name}\n\nPetición: ${request}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});

// Funcionalidad de edición
const editButtons = document.querySelectorAll('.edit-btn');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editModalTitle = document.getElementById('editModalTitle');
const editTitleInput = document.getElementById('editTitle');
const editContentInput = document.getElementById('editContent');
const editDateInput = document.getElementById('editDate');

let currentEditTarget = null;

editButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentEditTarget = button.dataset.target;
        const targetElement = document.getElementById(currentEditTarget);
        
        editModalTitle.textContent = `Editar ${targetElement.tagName === 'H3' ? 'Título' : 'Contenido'}`;
        
        if (targetElement.tagName === 'H3') {
            editTitleInput.value = targetElement.textContent;
            editTitleInput.style.display = 'block';
            editContentInput.style.display = 'none';
            editDateInput.style.display = 'none';
        } else if (targetElement.id.includes('date')) {
            editDateInput.value = targetElement.textContent.replace('Fecha:', '').trim();
            editTitleInput.style.display = 'none';
            editContentInput.style.display = 'none';
            editDateInput.style.display = 'block';
        } else {
            editContentInput.value = targetElement.textContent;
            editTitleInput.style.display = 'none';
            editContentInput.style.display = 'block';
            editDateInput.style.display = 'none';
        }
        
        editModal.style.display = 'block';
    });
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(currentEditTarget);
    
    if (targetElement.tagName === 'H3') {
        targetElement.textContent = editTitleInput.value;
    } else if (targetElement.id.includes('date')) {
        targetElement.textContent = `Fecha: ${editDateInput.value}`;
    } else {
        targetElement.textContent = editContentInput.value;
    }
    
    // Guardar cambios en localStorage
    localStorage.setItem(currentEditTarget, targetElement.textContent);
    
    editModal.style.display = 'none';
});

// Cerrar el modal de edición si se hace clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Cargar contenido guardado al cargar la página
window.addEventListener('load', () => {
    document.querySelectorAll('[id]').forEach(element => {
        const savedContent = localStorage.getItem(element.id);
        if (savedContent) {
            element.textContent = savedContent;
        }
    });
});

// Funcionalidad para volver al inicio al hacer clic en el logo
document.querySelector('.logo-link').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Cerrar el menú móvil al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-icon')) {
        navLinks.classList.remove('active');
    }
});