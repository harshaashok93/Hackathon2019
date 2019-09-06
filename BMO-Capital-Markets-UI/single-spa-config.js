import { registerApplication, start } from 'single-spa'

registerApplication(
    'react',
    () => import('./src/react/root.app.js'),
    () => (
        (location.pathname === "/" || location.pathname === "/our-department/")
        ? true
        : false
    )
);

registerApplication(
    'vue',
    () => import('./src/vue/vue.app.js'),
    () => location.pathname === "/" ? true : false
);

start();