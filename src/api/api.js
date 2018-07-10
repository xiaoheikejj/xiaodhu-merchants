import { Loading , Message } from 'element-ui';
import axios from 'axios';
import qs from 'qs';

// let baseUrl = 'http://192.168.1.190:8080'; //    开发或者提交都用这个地址
let baseUrl = 'http://192.168.1.251:9001/merchant.call';
// let baseUrl = 'http://coffee.dev.miaotu.net';

// 通用ajax请求方法-不含token
export const commonAjax = (path, method, params) => {
    var instance = axios.create({

    })
    if(method === 'get'){
        return instance.get(`${baseUrl}${path}`, {params}).then(res => {
            if (res.data) {
                return res.data;
            } else {
                var err = new Error();
                err.msg = "服务器内部错误";
                return Promise.reject(err);
            }
        }).catch(function (err) {
            throw err;
        });
    } else if(method === 'post'){
        params = qs.stringify(params);
        return instance.post(`${baseUrl}${path}`, params).then(res => {
            if (res.data) {
                return res.data;
            } else {
                var err = new Error();
                err.msg = "服务器内部错误";
                return Promise.reject(err);
            }
        }).catch(function (err) {
            throw err;
        });
    } 
}

// 通用ajax请求方法-包含token
export const tokenAjax = (path, method, params) => {
    var instance = axios.create({
        headers: {
            "token": sessionStorage.getItem("token"),
        },
    })

    if(method === 'get'){
        return instance.get(`${baseUrl}${path}`, {params}).then(res => {
            if (res.data) {
                return res.data;
            } else {
                var err = new Error();
                err.msg = "服务器内部错误";
                return Promise.reject(err);
            }
        }).catch(function (err) {
            throw err;
        });
    } else if(method === 'post'){
        params = qs.stringify(params);
        return instance.post(`${baseUrl}${path}`, params).then(res => {
            if (res.data) {
                return res.data;
            } else {
                var err = new Error();
                err.msg = "服务器内部错误";
                return Promise.reject(err);
            }
        }).catch(function (err) {
            throw err;
        });
    } 
}
