
// import { registerServiceWorker } from '../src/registerServiceWorker';
import {registerApplication, start} from 'single-spa';


registerApplication(
  'root',          // Name of this single-spa application
  loadingFunction, // Our loading function
  activityFunction // Our activity function
);

start();
// registerServiceWorker();

if (module.hot) {
  module.hot.accept();
}