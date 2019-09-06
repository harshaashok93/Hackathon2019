// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import axios from 'axios'
// import router from './router'

export default {
  getdata() {
    return axios.get("/api/data").then(response => {
        return response.data.names;
    });
  }
}
