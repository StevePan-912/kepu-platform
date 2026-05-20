# API 接口文档

> 本文档由成员1（基础设施层）维护。所有接口统一响应格式：`{ success: boolean, data?: T, error?: string }`

## 认证方式

所有需要登录的接口均通过 `Authorization: Bearer <supabase_access_token>` 传递 token。  
获取 token 方式：调用 `/api/auth/verify` 后从响应的 `access_token` 字段获取。

---

## 🔐 认证接口

### POST `/api/auth/phone`
发送手机 OTP 验证码

**请求体：**
```json
{ "phone": "13800138000" }
```

**响应：**
```json
{ "success": true, "data": { "message": "验证码已发送" } }
```

---

### POST `/api/auth/verify`
验证 OTP，完成登录（首次登录自动建档）

**请求体：**
```json
{ "phone": "13800138000", "token": "123456" }
```

**响应：**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "...",
    "user": { "id": "uuid", "phone": "13800138000" }
  }
}
```

---

## 👤 用户接口

### GET `/api/user/profile` 🔒
获取当前用户信息（首次访问自动建档）

### PATCH `/api/user/profile` 🔒
更新用户信息
```json
{ "nickname": "新昵称" }
```

### GET `/api/user/points?limit=20` 🔒
获取积分流水记录

### GET `/api/user/portrait?days=30&include=portrait,search,points,preference` 🔒
获取居民完整画像（支持按模块按需加载）

---

## 📚 科普资源

### GET `/api/resources?category=科技`
获取资源列表（可按分类筛选）

### GET `/api/resources/:id`
获取资源详情（自动记录浏览行为）

---

## 🖥️ 设备点位

### GET `/api/devices?status=online`
获取设备列表（status: online/offline/maintenance）

### GET `/api/devices/:id`
获取单个设备详情

---

## 🛍️ 积分商城

### GET `/api/mall/products?category=礼品`
获取商品列表（仅库存>0 且上架）

### GET `/api/mall/exchange` 🔒
获取当前用户兑换记录

### POST `/api/mall/exchange` 🔒
兑换商品
```json
{ "product_id": "uuid" }
```
**错误码：**
- `400` 积分不足 / 库存不足 / 参数缺失
- `401` 未登录

---

## 🙌 志愿者

### GET `/api/volunteer/tasks?status=open`
获取志愿任务列表（status: open/in_progress/completed）

### GET `/api/volunteer/join` 🔒
获取当前用户参与记录

### POST `/api/volunteer/join` 🔒
报名任务（重复报名返回 `409`）
```json
{ "task_id": "uuid" }
```

---

## 📊 行为 & 热词

### GET `/api/activity?limit=50` 🔒
获取当前用户行为记录

### POST `/api/activity` 🔒
上报行为（搜索行为自动同步热词）
```json
{
  "action_type": "search",
  "search_keyword": "天文",
  "duration_seconds": 30
}
```
**action_type 可选值：** `search` / `view_resource` / `scan_ar` / `play_audio` / `activity_join` / `feedback`

### GET `/api/hot-words?period=weekly&limit=30`
获取热词榜（period: daily/weekly）

---

## 💡 决策建议

### GET `/api/decision?type=activity`
获取智慧决策建议（按 priority 降序）

---

## 📈 统计接口（管理员）

### GET `/api/admin/stats?days=7` 🔒👑
平台综合统计（用户数、资源数、设备数、活跃趋势）

### GET `/api/admin/users?role=resident&limit=50&offset=0` 🔒👑
用户列表（支持角色筛选 + 分页）

### PATCH `/api/admin/users` 🔒👑
修改用户角色
```json
{ "user_id": "uuid", "role": "volunteer" }
```

### GET `/api/stats/residents?days=14&limit=20` 🔒👑
居民活跃度统计（活跃趋势 + 环比增长 + 积分排行）

### GET `/api/stats/resources?days=7&top=10`
资源统计（分类分布 + 热门资源排行，公开接口）

---

## 图例
- 🔒 需要登录（Authorization: Bearer token）
- 👑 需要 admin 角色
