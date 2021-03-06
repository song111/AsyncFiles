import fs from "fs-extra";
import path from "path";
import rimraf from "rimraf";

/** 包装promise函数返回值
 * @param {Promise} promise
 */
export const to = (promise: Promise<any>): Promise<any> => {
  return promise
    .then((res: any) => [null, res])
    .catch((err: any) => [err, null]);
};

/**  判断一个路径是目录还是文件
 * 1.假如存在用fs.stat 判断路径类型，不存在用path.extname判断
 * @param {String} pathStr
 * @returns {boolean}
 */
export const pathIsFile = async (pathStr: string): Promise<Boolean> => {
  if (fs.existsSync(pathStr)) {
    const stats = await fs.promises.stat(pathStr);
    return stats.isFile();
  } else {
    return path.extname(pathStr) !== ""; // 这里对于不存在的路径直接判断是否有后缀
  }
};

/** 拷贝文件，对于目录会进行递归拷贝
 * @param {String}source
 * @param {String}target
 */
export const copyFiles = async (
  source: string,
  target: string
): Promise<void> => {
  try {
    // const isFile = await pathIsFile(target);
    // const isExists = fs.existsSync(target);
    // if (isExists && isFile) await rimrafPromify(target);
    await rimrafPromify(target);
    await fs.copy(source, target); // 拷贝文件夹会直接把文件内容递归拷贝
  } catch (err) {
    console.error(err);
  }
};

/** rimraf 函数的promise 改造
 * @param {String} pathStr
 */
export const rimrafPromify = (pathStr: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    rimraf(pathStr, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

export const log = console.log.bind(console);

// 进程退出
export const exit = (code: number, msg: string) => {
  log(msg);
  process.exit(code);
};
