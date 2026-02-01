const http = require('http');

function testSuggestedPrice(originalPrice, desc) {
  const data = JSON.stringify({ originalPrice, desc });
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/product/price',
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
  console.log('=== 测试AI智能定价功能 ===\n');

  const testCases = [
    {
      name: '九成新iPhone 15',
      originalPrice: 5999,
      desc: '成色：九成新\n功能是否完好：功能完好\n瑕疵：无瑕疵\n使用时长：使用3个月'
    },
    {
      name: '八成新运动鞋',
      originalPrice: 899,
      desc: '成色：八成新\n功能是否完好：功能正常\n瑕疵：鞋底有轻微磨损\n使用时长：使用半年'
    },
    {
      name: '全新保温杯',
      originalPrice: 199,
      desc: '成色：全新\n功能是否完好：功能完好\n瑕疵：无瑕疵\n使用时长：未使用'
    },
    {
      name: '七成新书籍',
      originalPrice: 59,
      desc: '成色：七成新\n功能是否完好：内容完整\n瑕疵：封面有轻微折痕\n使用时长：使用1年'
    },
    {
      name: '六成新家具',
      originalPrice: 299,
      desc: '成色：六成新\n功能是否完好：功能正常\n瑕疵：桌面有划痕\n使用时长：使用2年'
    }
  ];

  for (const testCase of testCases) {
    console.log(`测试: ${testCase.name}`);
    console.log(`原价: ${testCase.originalPrice}元`);
    console.log(`描述: ${testCase.desc.replace(/\n/g, ' ')}`);
    try {
      const result = await testSuggestedPrice(testCase.originalPrice, testCase.desc);
      console.log('结果:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        const discount = ((testCase.originalPrice - result.data) / testCase.originalPrice * 100).toFixed(1);
        console.log(`折扣: ${discount}%`);
      }
    } catch (error) {
      console.error('错误:', error.message);
    }
    console.log('---\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

runTests().catch(console.error);
