// 超时 的 Timeout 默认 10s
export default function Timeout(promise, ms = 60000) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
    promise.then(resolve, reject);
  });
}