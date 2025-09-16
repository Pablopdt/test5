const rootElement = document.documentElement;
const themeToggleButton = document.querySelector('.theme-toggle');
const themeIcon = themeToggleButton?.querySelector('.theme-toggle__icon');
const THEME_STORAGE_KEY = 'neuronautas-theme';

const getStoredTheme = () => localStorage.getItem(THEME_STORAGE_KEY);
const getPreferredScheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const setTheme = (theme) => {
  const targetTheme = theme || getStoredTheme() || getPreferredScheme();
  const isDark = targetTheme === 'dark';
  rootElement.classList.toggle('theme-dark', isDark);
  if (themeIcon) {
    themeIcon.textContent = isDark ? '🌞' : '🌙';
  }
  if (themeToggleButton) {
    themeToggleButton.setAttribute(
      'aria-label',
      isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
    );
  }
};

const persistTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

themeToggleButton?.addEventListener('click', () => {
  const isDark = rootElement.classList.toggle('theme-dark');
  if (themeIcon) {
    themeIcon.textContent = isDark ? '🌞' : '🌙';
  }
  themeToggleButton.setAttribute(
    'aria-label',
    isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
  );
  persistTheme(isDark ? 'dark' : 'light');
});

const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSchemeChange = (event) => {
  if (!getStoredTheme()) {
    setTheme(event.matches ? 'dark' : 'light');
  }
};

if (typeof schemeQuery.addEventListener === 'function') {
  schemeQuery.addEventListener('change', handleSchemeChange);
} else if (typeof schemeQuery.addListener === 'function') {
  schemeQuery.addListener(handleSchemeChange);
}

setTheme();

// Filtros de artículos
const filterButtons = document.querySelectorAll('.filter-button');
const articleCards = document.querySelectorAll('.articles__grid .card');
const filtersStatus = document.querySelector('.filters__status');

const updateFilterStatus = (visibleCount) => {
  if (filtersStatus) {
    const label = visibleCount === 1 ? 'artículo' : 'artículos';
    filtersStatus.textContent = `Mostrando ${visibleCount} ${label}`;
  }
};

const applyFilter = (category) => {
  let visibleCount = 0;
  articleCards.forEach((card) => {
    const matches = category === 'todas' || card.dataset.category === category;
    card.classList.toggle('is-hidden', !matches);
    if (matches) visibleCount += 1;
  });
  updateFilterStatus(visibleCount);
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');
    applyFilter(button.dataset.filter);
  });
});

const activeFilter = document.querySelector('.filter-button.is-active');
if (activeFilter) {
  applyFilter(activeFilter.dataset.filter);
} else {
  applyFilter('todas');
}

// Newsletter
const newsletterForm = document.querySelector('.newsletter__form');
const newsletterFeedback = document.querySelector('.newsletter__feedback');

const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(newsletterForm);
  const email = formData.get('email');

  newsletterFeedback.textContent = '';
  newsletterFeedback.classList.remove('is-error', 'is-success');

  if (!email || typeof email !== 'string' || !email.trim()) {
    newsletterFeedback.textContent = 'Ingresa tu correo electrónico.';
    newsletterFeedback.classList.add('is-error');
    return;
  }

  if (!emailPattern.test(email)) {
    newsletterFeedback.textContent = 'El correo parece no ser válido. Intenta nuevamente.';
    newsletterFeedback.classList.add('is-error');
    return;
  }

  newsletterFeedback.textContent = '¡Listo! Revisa tu bandeja para confirmar la suscripción.';
  newsletterFeedback.classList.add('is-success');
  newsletterForm.reset();
});

// Año dinámico en el pie de página
const yearTarget = document.getElementById('year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear().toString();
}
