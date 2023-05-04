import { switchTheme } from './switch-theme.js';
import { startMain } from './main-menu.js';
import { generateCode, dataJson } from './parse-data.js';
import { startGame } from './game-menu.js';

const themeButton = document.querySelector('.theme_button');
themeButton.addEventListener('click', switchTheme);
const code = generateCode(dataJson);
startMain(code);
startGame(code);
