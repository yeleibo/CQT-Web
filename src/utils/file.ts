import Token from "@/utils/token";

/**
 * 下载文件
 * @param url 下载链接
 * @param params 参数
 */
export const downloadFile = (url: string, params?: Record<string, any>) => {
  const formElement = document.createElement('form');
  formElement.style.display = 'display:none;';
  formElement.method = 'GET';
  formElement.action = url;
  // 添加参数
  if (params) {
    Object.keys(params).forEach((key: string) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'hidden';
      inputElement.name = key;
      inputElement.value = params[key];
      formElement.appendChild(inputElement);
    });
  }
  const inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  inputElement.name = ':X_Access_Token';
  inputElement.value = Token.get();
  formElement.appendChild(inputElement);
  document.body.appendChild(formElement);
  formElement.submit();
  document.body.removeChild(formElement);
};

export const downloadFileByUrl = (url: string, name: string, type: string) => {
  const downNode = document.createElement('a');
  downNode.style.display = 'none';
  downNode.download = `${name}.${type}`;
  downNode.href = url;
  document.body.appendChild(downNode);
  downNode.click();
  document.body.removeChild(downNode);
};

///printFile("/test.pdf");
export  const printFile=(url:string)=>{
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  iframe.onload = () => {
    iframe.contentWindow?.print();
  };
};
