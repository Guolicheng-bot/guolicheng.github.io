from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_FILE = 'goods_data.json'

def load_goods():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_goods(goods_list):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(goods_list, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/goods/publish', methods=['POST'])
def publish_goods():
    try:
        data = request.json
        
        if not data:
            return jsonify({'code': 400, 'msg': '请求数据为空', 'data': None})
        
        name = data.get('name', '')
        category = data.get('category', '')
        img_base64_list = data.get('imgBase64List', [])
        desc = data.get('desc', '')
        original_price = data.get('originalPrice', 0)
        sale_price = data.get('salePrice', 0)
        contact = data.get('contact', '')
        
        if not name:
            return jsonify({'code': 400, 'msg': '请填写物品名称', 'data': None})
        
        if not category:
            return jsonify({'code': 400, 'msg': '请选择商品品类', 'data': None})
        
        if not img_base64_list or len(img_base64_list) < 3:
            return jsonify({'code': 400, 'msg': '请上传3张商品图片', 'data': None})
        
        if not original_price or not sale_price:
            return jsonify({'code': 400, 'msg': '请填写价格信息', 'data': None})
        
        if sale_price > original_price:
            return jsonify({'code': 400, 'msg': '最终售价不可高于原价', 'data': None})
        
        if not contact:
            return jsonify({'code': 400, 'msg': '请填写联系方式', 'data': None})
        
        new_goods = {
            'id': datetime.now().strftime('%Y%m%d%H%M%S%f'),
            'name': name,
            'category': category,
            'imgBase64List': img_base64_list,
            'desc': desc,
            'originalPrice': original_price,
            'salePrice': sale_price,
            'contact': contact,
            'publishTime': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        goods_list = load_goods()
        goods_list.insert(0, new_goods)
        save_goods(goods_list)
        
        return jsonify({'code': 200, 'msg': '发布成功', 'data': None})
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'发布失败: {str(e)}', 'data': None})

@app.route('/api/goods/list', methods=['POST'])
def get_goods_list():
    try:
        goods_list = load_goods()
        return jsonify({'code': 200, 'msg': '成功', 'data': goods_list})
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'获取失败: {str(e)}', 'data': []})

@app.route('/api/goods/update', methods=['POST'])
def update_goods():
    try:
        data = request.json
        
        if not data:
            return jsonify({'code': 400, 'msg': '请求数据为空', 'data': None})
        
        goods_id = data.get('id', '')
        name = data.get('name', '')
        category = data.get('category', '')
        img_base64_list = data.get('imgBase64List', [])
        desc = data.get('desc', '')
        original_price = data.get('originalPrice', 0)
        sale_price = data.get('salePrice', 0)
        contact = data.get('contact', '')
        
        if not goods_id:
            return jsonify({'code': 400, 'msg': '商品ID不能为空', 'data': None})
        
        if not name:
            return jsonify({'code': 400, 'msg': '请填写物品名称', 'data': None})
        
        if not img_base64_list or len(img_base64_list) < 3:
            return jsonify({'code': 400, 'msg': '请上传3张商品图片', 'data': None})
        
        if not original_price or not sale_price:
            return jsonify({'code': 400, 'msg': '请填写价格信息', 'data': None})
        
        if sale_price > original_price:
            return jsonify({'code': 400, 'msg': '最终售价不可高于原价', 'data': None})
        
        if not contact:
            return jsonify({'code': 400, 'msg': '请填写联系方式', 'data': None})
        
        goods_list = load_goods()
        
        for i, goods in enumerate(goods_list):
            if goods.get('id') == goods_id:
                goods_list[i] = {
                    'id': goods_id,
                    'name': name,
                    'category': category,
                    'imgBase64List': img_base64_list,
                    'desc': desc,
                    'originalPrice': original_price,
                    'salePrice': sale_price,
                    'contact': contact,
                    'publishTime': goods.get('publishTime', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                }
                save_goods(goods_list)
                return jsonify({'code': 200, 'msg': '修改成功', 'data': None})
        
        return jsonify({'code': 404, 'msg': '商品不存在', 'data': None})
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'修改失败: {str(e)}', 'data': None})

@app.route('/api/goods/delete', methods=['POST'])
def delete_goods():
    try:
        data = request.json
        
        if not data:
            return jsonify({'code': 400, 'msg': '请求数据为空', 'data': None})
        
        goods_id = data.get('id', '')
        
        if not goods_id:
            return jsonify({'code': 400, 'msg': '商品ID不能为空', 'data': None})
        
        goods_list = load_goods()
        
        for i, goods in enumerate(goods_list):
            if goods.get('id') == goods_id:
                goods_list.pop(i)
                save_goods(goods_list)
                return jsonify({'code': 200, 'msg': '下架成功', 'data': None})
        
        return jsonify({'code': 404, 'msg': '商品不存在', 'data': None})
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'下架失败: {str(e)}', 'data': None})

@app.route('/api/ai/generateDesc', methods=['POST'])
def generate_desc():
    try:
        data = request.json
        img_base64_list = data.get('imgBase64List', [])
        
        return jsonify({
            'code': 200,
            'msg': '成功',
            'data': '九成新，功能完好，无瑕疵，诚心转让'
        })
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'生成失败: {str(e)}', 'data': ''})

@app.route('/api/ai/generatePrice', methods=['POST'])
def generate_price():
    try:
        data = request.json
        original_price = data.get('originalPrice', 0)
        
        suggested_price = int(original_price * 0.7)
        
        return jsonify({
            'code': 200,
            'msg': '成功',
            'data': suggested_price
        })
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'定价失败: {str(e)}', 'data': 0})

@app.route('/api/ai/matchGoods', methods=['POST'])
def match_goods():
    try:
        data = request.json
        keyword = data.get('keyword', '').lower()
        goods_list = data.get('goodsList', [])
        
        if not keyword:
            return jsonify({'code': 200, 'msg': '成功', 'data': goods_list})
        
        matched_goods = []
        for goods in goods_list:
            name = goods.get('name', '').lower()
            desc = goods.get('desc', '').lower()
            if keyword in name or keyword in desc:
                matched_goods.append(goods)
        
        return jsonify({'code': 200, 'msg': '成功', 'data': matched_goods[:10]})
    
    except Exception as e:
        return jsonify({'code': 500, 'msg': f'匹配失败: {str(e)}', 'data': []})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)