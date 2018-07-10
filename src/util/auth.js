// const TokenKey = 'Admin-Token'
const userName = 'userName';

export function getToken() {
  return sessionStorage.getItem("userName");
}

export function setToken(userName) {
  return sessionStorage.setItem("userName",userName);
}

export function removeToken() {
  return sessionStorage.removeItem("userName");
}

export function cleanToken() {
  return sessionStorage.removeItem("userName");
}