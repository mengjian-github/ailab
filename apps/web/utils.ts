/**
 * 获取URL中的参数
 * @param name
 * @returns
 */
export function getQueryParam(name?: string) {
  // 将查询字符串（包含 "?"）截取并解析成对象
  const queryParamsString = window.location.search.substring(1);
  const queryParamsArr = queryParamsString.split("&");

  // 遍历对象，将它们转换成 key-value 键值对形式
  const queryParamsObj: any = {};
  for (let i = 0, len = queryParamsArr.length; i < len; i++) {
    const queryParam = queryParamsArr[i].split("=");
    const key = decodeURIComponent(queryParam[0]);
    const value = decodeURIComponent(queryParam[1] || "");
    queryParamsObj[key] = value;
  }

  // 返回指定参数名的值
  if (name) {
    return queryParamsObj[name] || null;
  }
  return queryParamsObj;
}

/**
 * 判断是否是高级模式
 * @returns
 */
export function isAdvanced() {
  return getQueryParam("advanced") === "1";
}
