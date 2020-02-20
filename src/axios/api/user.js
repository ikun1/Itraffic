//导入请求方式
import {
    $get,
    $post,
    $update,
    $delete
  } from '../http'; 
  
  //获取用户信息接口
  const getUser = data => {
    return $get('/api/getUserInfo', data);
  };
  
  //其他接口类似
  
  
  //导出接口
  export default {
  getUser,
  }