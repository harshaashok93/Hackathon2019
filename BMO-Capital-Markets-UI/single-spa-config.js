import { registerApplication, start } from 'single-spa'

registerApplication(
    'react',
    () => import('./src/react/root.app.js'),
    () => true
);

registerApplication(
    'vue',
    () => import('./src/vue/vue.app.js'),
    () => location.pathname === "/" ? true : false
);

start();