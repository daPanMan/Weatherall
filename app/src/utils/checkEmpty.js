/**
 * @param  {...any} args
 */
function checkEmpty(...args) {
  let ret;
  if (args.length > 0) {
    ret = args.shift();
    let tmp;
    while (ret && args.length > 0) {
      tmp = args.shift();
      ret = ret[tmp];
    }
  }
  return ret || '';
}

export default checkEmpty;
