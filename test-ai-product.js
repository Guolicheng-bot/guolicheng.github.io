const http = require('http');

function testProductInfo(productName) {
  const data = JSON.stringify({ productName });
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/product/info',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== 测试AI商品信息生成API ===\n');

  const testCases = [
    'Apple Watch Series 11',
    'iPhone 15',
    '华为Mate 60',
    '小米14'
  ];

  for (const testCase of testCases) {
    console.log(`测试: ${testCase}`);
    try {
      const result = await testProductInfo(testCase);
      console.log('结果:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('错误:', error.message);
    }
    console.log('---\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

runTests().catch(console.error);
