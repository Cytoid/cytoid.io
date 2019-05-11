import Vue from 'vue'
import Antd from 'ant-design-vue/lib'

import Menu from '../components/menu/Menu'
import MenuLinkItem from '../components/menu/MenuLinkItem'

export default function () {
  Vue.use(Antd)

  Vue.component('cy-menu', Menu)
  Vue.component('cy-menu-link-item', MenuLinkItem)
}
