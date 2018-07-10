import { Loading , Message } from 'element-ui';
import axios from 'axios';
import qs from 'qs';

// export const baseUrl = 'http://192.168.1.248:8080/merchant.call';   //test
// export const baseUrl = 'http://192.168.1.142:8080'  //142test
export const baseUrl = 'http://120.27.245.101:9001/merchant.call'    //pro

// 通用ajax请求方法-不含token
export const Ajax = (path, method, params) => {
    var instance = axios.create({

    })
    if(method === 'get'){
        return instance.get(`${baseUrl}${path}`, {params}).then(res => {
            console.log(res)
            if (res.data) {
                console.log(res.data);
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
export const TokenAjax = (path, method, params) => {
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
