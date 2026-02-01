# 环境变量配置说明

## 本地开发配置

### 1. 复制环境变量模板
```bash
cp .env.example .env
```

### 2. 配置百度OCR API

#### 获取API密钥：
1. 访问 [百度智能云控制台](https://cloud.baidu.com/)
2. 注册/登录账号
3. 进入 [文字识别服务](https://cloud.baidu.com/product/ocr)
4. 创建应用，获取 API Key 和 Secret Key

#### 配置到.env文件：
```
BAIDU_API_KEY=你的百度API Key
BAIDU_SECRET_KEY=你的百度Secret Key
```

### 3. 配置豆包API

#### 获取API密钥：
1. 访问 [火山引擎控制台](https://console.volcengine.com/)
2. 注册/登录账号
3. 进入 [火山方舟](https://www.volcengine.com/product/ark)
4. 创建应用，获取 API Key 和 API URL

#### 配置到.env文件：
```
DOUBAN_API_KEY=你的豆包API Key
DOUBAN_API_URL=你的豆包API URL
```

### 4. 配置端口（可选）
```
PORT=3000
```

## Vercel部署配置

### 1. 准备工作
- 确保已注册 [Vercel](https://vercel.com/) 账号
- 安装 Vercel CLI（可选）：`npm i -g vercel`

### 2. 部署步骤

#### 方法一：通过Vercel CLI部署
```bash
# 进入项目目录
cd backend

# 登录Vercel
vercel login

# 部署
vercel
```

#### 方法二：通过Vercel网站部署
1. 将代码推送到 GitHub
2. 登录 [Vercel](https://vercel.com/)
3. 点击 "Add New Project"
4. 选择你的 GitHub 仓库
5. 配置环境变量（见下方）
6. 点击 "Deploy"

### 3. Vercel环境变量配置

在Vercel项目设置中添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `BAIDU_API_KEY` | 你的百度API Key | 百度OCR API密钥 |
| `BAIDU_SECRET_KEY` | 你的百度Secret Key | 百度OCR密钥 |
| `DOUBAN_API_KEY` | 你的豆包API Key | 豆包API密钥 |
| `DOUBAN_API_URL` | 你的豆包API URL | 豆包API地址 |
| `PORT` | 3000 | 服务器端口（Vercel会自动覆盖） |

### 4. 部署后获取API地址

部署完成后，Vercel会提供一个URL，例如：
```
https://your-project-name.vercel.app
```

前端需要将 `YOUR_BACKEND_URL` 替换为这个地址。

## 注意事项

1. **不要将.env文件提交到Git仓库**，它包含敏感信息
2. **定期更新API密钥**，确保安全性
3. **监控API调用次数**，避免超出免费额度
4. **Vercel免费版限制**：
   - 每月100GB带宽
   - 每月6000分钟执行时间
   - 适合个人项目和小型应用

## 故障排查

### 问题1：API调用失败
- 检查API密钥是否正确
- 确认API服务是否正常
- 查看Vercel日志获取详细错误信息

### 问题2：环境变量未生效
- 确认环境变量名称拼写正确
- 重新部署项目
- 检查Vercel环境变量配置

### 问题3：跨域问题
- 确保后端已配置CORS
- 检查前端请求地址是否正确
