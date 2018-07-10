import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/util/auth' 

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
    NProgress.start();
    if(getToken()){
      next();
      NProgress.done();
    }else{
      if (whiteList.indexOf(to.path) !== -1) {
        next();
        NProgress.done();
      } else {
        next('/login');
        NProgress.done();
      }
  
    }
});
router.afterEach((to, from) => {
  NProgress.done()
});