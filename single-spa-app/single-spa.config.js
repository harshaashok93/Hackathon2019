import { registerApplication, start } from 'single-spa'

registerApplication(
  'vue',
  () => import('./src/vue/vue.app.js'),
  () => location.pathname === "/" ? true : false
);

registerApplication(
  'react',
  () => import('./src/react/main.app.js'),
  () => location.pathname === "/react"  ? true : false
);

registerApplication(
  'react1',
  () => import('./src/react1/main.app.js'),
  () => location.pathname === "/" ? true : false
);

start();