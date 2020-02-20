import apiList from './api/index'

const install = Vue => {
    if(install.installed)
     return;
    install.installed = true;
    //将接口封装成Vue插件，直接调用
    Object.defineProperties(Vue.prototype, {
        $api: {
            get() {
                return apiList
            }
        }
    })
}

export default install