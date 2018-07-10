import Vue from 'vue'
import Router from 'vue-router'

//登录
import Login from '@/page/Login/Login' //登录

import Home from '@/layout/Home'

//首页
import Index from '@/page/Index/Index' //首页

//呼叫计划
import ProList from '@/page/CallPro/ProList' //计划列表
import PlanDetail from '@/page/CallPro/PlanDetail' //计划详情

//CRM 管理
import PrivateUser from '@/page/Crm/PrivateUser' //私海用户
import PublicUser from '@/page/Crm/PublicUser' //公海用户
import VisitPro from '@/page/Crm/VisitPro' //拜访计划
import CallRec from '@/page/Crm/CallRec' //通话记录

//账户 管理
import AccountMan from '@/page/Account/AccountMan' //子账户管理
import SimMan from '@/page/Account/SimMan' //手机卡管理
import VoiceTemplate from '@/page/Account/VoiceTemplate' //语音模板管理
import IdConfig from '@/page/Account/IdConfig' //权限配置

//其他
import Advice from '@/page/Other/Advice' //意见建议
import Repair from '@/page/Other/Repair' //故障报修

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login, 
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
         {//计划列表
          path: '/proList',
          name: 'ProList',
          component: ProList
        },
        {//计划详情
          path: '/planDetail',
          name: 'PlanDetail',
          component: PlanDetail
        },
         {//私海用户
          path: '/privateUser',
          name: 'PrivateUser',
          component: PrivateUser
        },
        {//公海用户
          path: '/publicUser',
          name: 'PublicUser',
          component: PublicUser
        },
        {//拜访计划
          path: '/visitPro',
          name: 'VisitPro',
          component: VisitPro
        },
        {//通话记录
          path: '/callRec',
          name: 'CallRec',
          component: CallRec
        },
         {//子账户管理
          path: '/accountMan',
          name: 'AccountMan',
          component: AccountMan
        },
        {//手机卡管理
          path: '/simMan',
          name: 'SimMan',
          component: SimMan
        },
        {//手语音模板管理
          path: '/voiceTemplate',
          name: 'VoiceTemplate',
          component: VoiceTemplate
        },
        {//权限配置
          path: '/idConfig',
          name: 'IdConfig',
          component: IdConfig
        },
        {//意见建议
          path: '/advice',
          name: 'Advice',
          component: Advice
        },
        {//故障报修
          path: '/repair',
          name: 'Repair',
          component: Repair
        }
      ]
    }
  ]
})
