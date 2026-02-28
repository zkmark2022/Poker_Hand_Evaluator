# Poker Equity Calculator - Backend

FastAPI 服务，提供德州扑克胜率计算 API。

## 技术栈
- Python 3.11+
- FastAPI
- Pytest

## API
- POST /api/calculate-equity - 计算多玩家胜率

## 启动
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
