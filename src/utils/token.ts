///网络请求的认证token

let token: string;
const Token = {
  //使用缓存方案，根据token有效期来，需要确认
  // set: (token: string) => localStorage.setItem('Authorization', `Bearer ${token}`),
  // get: () => localStorage.getItem('Authorization')??"",
  set: (tokenValue: string) => token = `Bearer ${tokenValue}`,
  get: () => token,
};
export default Token;
