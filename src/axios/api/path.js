import{$getJson}from '../http';

//获取JSON数据
const getPathJson = data => {
  return $getJson('/static/path.json',data)
}

  //导出接口
  export default {
    getPathJson,
    }