const express = require('express');
const cors = require('cors');
require('dotenv').config();

const BaiduOCR = require('./services/baiduOCR');
const DoubanAI = require('./services/doubanAI');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const baiduOCR = new BaiduOCR(
  process.env.BAIDU_API_KEY,
  process.env.BAIDU_SECRET_KEY
);

const doubanAI = new DoubanAI(
  process.env.DOUBAN_API_KEY,
  process.env.DOUBAN_API_URL
);

app.get('/', (req, res) => {
  res.json({
    message: '校园闲置交易平台AI后端服务',
    version: '1.0.0',
    endpoints: {
      '/api/ocr': 'POST - OCR图片识别',
      '/api/product/info': 'POST - 查询商品信息'
    }
  });
});

app.post('/api/ocr', async (req, res) => {
  try {
    const { imgBase64List } = req.body;

    if (!imgBase64List || !Array.isArray(imgBase64List)) {
      return res.json({
        success: false,
        data: '',
        msg: '请提供图片Base64数组'
      });
    }

    if (imgBase64List.length === 0) {
      return res.json({
        success: false,
        data: '',
        msg: '图片数组不能为空'
      });
    }

    const ocrResult = await baiduOCR.recognizeMultipleImages(imgBase64List);

    res.json({
      success: true,
      data: ocrResult,
      msg: 'OCR识别成功'
    });
  } catch (error) {
    console.error('OCR接口错误:', error);
    res.json({
      success: false,
      data: '',
      msg: error.message || 'OCR识别失败，请重试'
    });
  }
});

app.post('/api/product/info', async (req, res) => {
  try {
    const { productName, category } = req.body;

    if (!productName || typeof productName !== 'string') {
      return res.json({
        success: false,
        data: null,
        msg: '请提供商品名称'
      });
    }

    const productInfo = await doubanAI.generateProductInfo(productName, category);

    res.json({
      success: true,
      data: productInfo,
      msg: '查询成功'
    });
  } catch (error) {
    console.error('商品信息查询接口错误:', error);
    res.json({
      success: false,
      data: null,
      msg: error.message || '查询失败，请重试'
    });
  }
});

app.post('/api/product/price', async (req, res) => {
  try {
    const { originalPrice, desc } = req.body;

    if (!originalPrice || isNaN(parseFloat(originalPrice))) {
      return res.json({
        success: false,
        data: 0,
        msg: '请提供有效的商品原价'
      });
    }

    if (!desc || typeof desc !== 'string') {
      return res.json({
        success: false,
        data: 0,
        msg: '请提供商品描述'
      });
    }

    const price = await doubanAI.generateSuggestedPrice(parseFloat(originalPrice), desc);

    res.json({
      success: true,
      data: price,
      msg: '定价成功'
    });
  } catch (error) {
    console.error('AI定价接口错误:', error);
    res.json({
      success: false,
      data: 0,
      msg: error.message || '定价失败，请重试'
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    msg: '接口不存在'
  });
});

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    msg: '服务器内部错误'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AI后端服务已启动，端口：${PORT}`);
    console.log(`访问地址：http://localhost:${PORT}`);
  });
}

module.exports = app;
