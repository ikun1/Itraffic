import axios from 'axios';

export const $getJson = function (method) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: method,
        dataType: "json",
        crossDomain: true,
        charset: "gbk",
        cache: false
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
})
}

// 请求拦截器
axios.interceptors.request.use( 
  config => {
    //发送请求前需要做什么，一般检查token
    return config;
  },

  error => {
   // 对请求错误做些什么
    return Promise.reject(error);
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么,一般是判断状态码，进行一些逻辑处理
    return response;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error) ;
  }
)

//GET请求
export const $get = function (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',//请求方式
      url: url,         //请求url
      headers:"" ,  //请求头设置,
      params: params,    //请求参数
      baseURL: ""//基础地址,将自动加在 `url` 前面
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

//POST请求
export const $post = function (url, param) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: "",
      data: param ? param : "", //数据体
      baseURL: ""
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

//DELETE请求
export const $delete = function (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url: url,
      headers: "",
      params,
      baseURL: ""
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

//PUT请求
export const $put = function (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: url,
      headers: "",
      data: params ? params : "",
      baseURL: ""
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}