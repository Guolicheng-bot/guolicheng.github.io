# 校园闲置交易平台 - AI功能完整实现

## 项目概述

本项目实现了基于百度OCR和豆包AI的真实AI功能，包括：
- **智能商品描述生成**：通过OCR识别商品图片，AI自动生成30-60字的校园风格描述
- **智能定价建议**：根据商品原价、OCR识别结果和描述，AI给出合理的二手价格

## 项目结构

```
change-school/
├── backend/                    # AI后端服务（Node.js + Express）
│   ├── index.js               # Express主入口
│   ├── package.json           # 依赖配置
│   ├── vercel.json            # Vercel部署配置
│   ├── .env.example           # 环境变量模板
│   ├── README_ENV.md          # 环境变量配置说明
│   └── services/              # API服务封装
│       ├── baiduOCR.js        # 百度OCR API封装
│       └── doubanAI.js        # 豆包AI API封装
├── index.html                 # 前端页面
├── app.py                     # Flask后端（原有）
└── goods_data.json            # 商品数据存储
```

## 快速开始

### 1. 后端部署

#### 方式一：本地运行

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 编辑.env文件，填入API密钥
# BAIDU_API_KEY=你的百度API Key
# BAIDU_SECRET_KEY=你的百度Secret Key
# DOUBAN_API_KEY=你的豆包API Key
# DOUBAN_API_URL=你的豆包API URL

# 启动服务
npm start
```

服务将在 `http://localhost:3000` 启动

#### 方式二：Vercel部署

1. 将代码推送到GitHub
2. 登录 [Vercel](https://vercel.com/)
3. 点击 "Add New Project"，选择GitHub仓库
4. 在项目设置中配置环境变量（见 `README_ENV.md`）
5. 点击 "Deploy"

部署完成后，Vercel会提供一个URL，例如：`https://your-project-name.vercel.app`

### 2. 前端配置

1. 打开 `index.html`
2. 搜索 `YOUR_BACKEND_URL`
3. 替换为你的后端地址：
   - 本地运行：`http://localhost:3000`
   - Vercel部署：`https://your-project-name.vercel.app`

例如：
```javascript
// 修改前
const ocrResponse = await fetch('YOUR_BACKEND_URL/api/ocr', {

// 修改后
const ocrResponse = await fetch('http://localhost:3000/api/ocr', {
```

### 3. 启动Flask后端（商品数据管理）

```bash
# 返回项目根目录
cd ..

# 启动Flask服务
python app.py
```

Flask服务将在 `http://localhost:8000` 启动

### 4. 访问前端

在浏览器中打开 `http://localhost:8000` 或 `http://127.0.0.1:8000`

## API接口说明

### 后端接口（AI服务）

#### 1. OCR图片识别
```
POST /api/ocr
Content-Type: application/json

请求体：
{
  "imgBase64List": ["data:image/jpeg;base64,...", ...]
}

响应：
{
  "success": true,
  "data": "OCR识别的文本内容",
  "msg": "OCR识别成功"
}
```

#### 2. AI生成商品描述
```
POST /api/ai/desc
Content-Type: application/json

请求体：
{
  "ocrResult": "OCR识别的文本内容"
}

响应：
{
  "success": true,
  "data": "九成新，功能完好，无瑕疵，诚心转让",
  "msg": "生成描述成功"
}
```

#### 3. AI智能定价
```
POST /api/ai/price
Content-Type: application/json

请求体：
{
  "originalPrice": 100,
  "ocrResult": "OCR识别的文本内容",
  "desc": "商品描述"
}

响应：
{
  "success": true,
  "data": 70,
  "msg": "定价成功"
}
```

### Flask接口（商品管理）

- `POST /api/goods/publish` - 发布商品
- `POST /api/goods/list` - 获取商品列表
- `POST /api/goods/update` - 更新商品
- `POST /api/goods/delete` - 删除商品

## 使用流程

### 发布商品（使用AI功能）

1. 点击"我要出售"按钮
2. 填写商品名称
3. 上传3张商品图片（自动压缩为800px宽度，质量80%）
4. 点击"AI帮写"按钮
   - 系统调用百度OCR识别图片
   - 调用豆包AI生成商品描述
   - 自动填充到描述输入框
5. 填写商品原价
6. 点击"AI智能定价"按钮
   - 系统调用百度OCR识别图片
   - 调用豆包AI生成建议售价
   - 自动填充到售价输入框
7. 根据需要调整描述和价格
8. 填写联系方式
9. 点击"确认发布"

## 技术栈

### 后端
- **Node.js** - 运行环境
- **Express** - Web框架
- **Axios** - HTTP客户端
- **dotenv** - 环境变量管理

### AI服务
- **百度OCR** - 图片文字识别
- **豆包AI** - 自然语言处理

### 前端
- **原生JavaScript** - 无框架依赖
- **CSS3** - 样式和动画
- **Canvas API** - 图片压缩

### 数据存储
- **Flask** - 商品数据管理
- **JSON文件** - 本地数据存储

## 注意事项

1. **API密钥安全**
   - 不要将 `.env` 文件提交到Git仓库
   - 在Vercel中配置环境变量时，使用加密存储
   - 定期更换API密钥

2. **API调用限制**
   - 百度OCR免费版：500次/天
   - 豆包AI免费版：有调用次数限制
   - 建议监控API使用量，避免超限

3. **图片处理**
   - 前端自动压缩图片，减少传输大小
   - 图片宽度限制为800px，质量80%
   - 支持JPG/PNG格式

4. **错误处理**
   - 所有API调用都有错误处理
   - 失败时会显示友好提示
   - 建议查看浏览器控制台获取详细错误信息

## 故障排查

### 问题1：AI功能无响应
- 检查后端服务是否正常运行
- 检查 `YOUR_BACKEND_URL` 是否正确配置
- 查看浏览器控制台是否有错误信息

### 问题2：OCR识别失败
- 检查百度API密钥是否正确
- 确认图片是否清晰
- 查看后端日志获取详细错误

### 问题3：AI生成结果不理想
- 尝试上传更清晰的图片
- 检查OCR识别结果是否准确
- 可以手动调整AI生成的内容

### 问题4：部署到Vercel后无法访问
- 检查环境变量是否正确配置
- 查看Vercel部署日志
- 确认前端 `YOUR_BACKEND_URL` 已更新为Vercel地址

## 扩展功能建议

1. **增加更多AI功能**
   - 智能商品分类
   - 智能推荐系统
   - 智能客服

2. **优化用户体验**
   - 添加更多图片滤镜
   - 支持视频上传
   - 实时聊天功能

3. **数据分析**
   - 商品热度统计
   - 价格趋势分析
   - 用户行为分析

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue或Pull Request。
