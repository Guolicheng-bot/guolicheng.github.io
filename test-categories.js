const http = require('http');

function testProductInfo(productName, category) {
  const data = JSON.stringify({ productName, category });
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
  console.log('=== 测试不同品类AI生成 ===\n');

  const testCases = [
    { name: 'Nike Air Jordan 1', category: 'shoes' },
    { name: '优衣库T恤', category: 'clothing' },
    { name: '周大福项链', category: 'jewelry' },
    { name: 'iPhone 15', category: 'electronics' },
    { name: '瑜伽垫', category: 'sports' },
    { name: '保温杯', category: 'daily' },
    { name: '三体', category: 'books' },
    { name: '宜家书桌', category: 'furniture' }
  ];

  for (const testCase of testCases) {
    console.log(`测试: ${testCase.name} (${testCase.category})`);
    try {
      const result = await testProductInfo(testCase.name, testCase.category);
      console.log('结果:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('错误:', error.message);
    }
    console.log('---\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

runTests().catch(console.error);
