'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const navLinks = document.querySelectorAll('.nav__link');
const navContainer = document.querySelector('.nav__links');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const section = document.querySelectorAll('.section');
const imgTarget = document.querySelectorAll('img[data-src]');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const slides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');
const dots = document.querySelectorAll('.dots__dot');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//  Smooth Scroll

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// navLinks.forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

navContainer.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id === '#') return;
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABS
tabsContainer.addEventListener('click', function (e) {
  const click = e.target.closest('.operations__tab');

  if (!click) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  click.classList.add('operations__tab--active');

  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${click.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handelHover = function (opacity, e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const img = link.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    img.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', handelHover.bind(null, 0.5));
nav.addEventListener('mouseout', handelHover.bind(null, 1));

// const initialCords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
const navHeight = nav.getBoundingClientRect().height;
const stickNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

// Scroll to view
const secCallback = function (entries, observe) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(secCallback, {
  root: null,
  threshold: 0.13,
});

section.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

// LaZY Load

const imgCallBack = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgLazyObserver = new IntersectionObserver(imgCallBack, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTarget.forEach(ImgSec => {
  imgLazyObserver.observe(ImgSec);
});

// Slider

const slider = function () {
  let currSlide = 0;
  let slideLength = slides.length;
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const dotActive = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSolide = function (currSlide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - currSlide)}%)`)
    );
  };
  const nextSlide = function () {
    currSlide === slideLength - 1 ? (currSlide = 0) : currSlide++;
    goToSolide(currSlide);
    dotActive(currSlide);
  };

  const prevSlide = function () {
    currSlide === 0 ? (currSlide = slideLength - 1) : currSlide--;
    goToSolide(currSlide);
    dotActive(currSlide);
  };

  const init = function () {
    createDots();
    goToSolide(0);
    dotActive(0);
  };
  init();
  // Event Listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;

      goToSolide(slide);
      dotActive(slide);
    }
  });
};

slider();
