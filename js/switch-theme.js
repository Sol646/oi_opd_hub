/* 
Copyright 2023 Солодовник Игорь Николаевич, Симоновский Даниил Леонидович, Козырев Даниил Владимирович, Ануфриева Виктория Дмитриевна
Licensed under the Apache License, Version 2.0 
*/

import { setThemeToCookie, getThemeFromCookie } from './cookies.js';

const poliImageElement = document.querySelector('.title__img');

const setLightTheme = () => {
  document.body.removeAttribute('theme');
  poliImageElement.src = '/img/light_logo.svg';
  setThemeToCookie('light');
};

const setDarkTheme = () => {
  document.body.setAttribute('theme', 'dark');
  poliImageElement.src = '/img/dark_logo.svg';
  setThemeToCookie('dark');
};

const switchTheme = () => {
  if (document.body.attributes.theme) {
    setLightTheme();
  } else {
    setDarkTheme();
  }
};

const setThemeFromCookie = () => {
  if (getThemeFromCookie() === 'dark') {
    setDarkTheme();
  } else {
    setLightTheme();
  }
};

export { switchTheme, setThemeFromCookie };
