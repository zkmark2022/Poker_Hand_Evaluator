# 极简德州扑克胜率动态模拟器

Minimal Texas Hold'em Equity Calculator with Monte Carlo Simulation.

## 架构

```
┌─────────────────┐     ┌─────────────────┐
│   React 前端    │────▶│  FastAPI 后端   │
│   (牌桌 UI)     │◀────│  (胜率计算)     │
└─────────────────┘     └─────────────────┘
```

## 功能
- 3 玩家德州扑克胜率计算
- 蒙特卡洛模拟 (1000 次)
- 实时胜率进度条
- 发牌动画

## 目录
- `/backend` - FastAPI 服务
- `/frontend` - React 应用

## 开发
详见各目录的 README.md
