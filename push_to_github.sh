#!/bin/bash
# 成员5代码推送脚本
# 在 kepu-platform 目录下执行此脚本

set -e

echo "========================================="
echo "  科普漫步 - 成员5代码推送脚本"
echo "========================================="

# 配置 git 用户（如已配置可跳过）
git config user.email "member5@kepu.com" 2>/dev/null || true
git config user.name "Member5" 2>/dev/null || true

# 检查是否已是 git 仓库
if [ ! -d ".git" ]; then
  echo "[1/6] 初始化 Git 仓库..."
  git init
  git branch -M main
else
  echo "[1/6] Git 仓库已存在，跳过初始化"
fi

# 添加远程仓库
echo "[2/6] 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/StevePan-912/kepu-platform.git

# 尝试拉取远程代码
echo "[3/6] 拉取远程代码..."
git fetch origin main 2>/dev/null && \
  git pull origin main --allow-unrelated-histories 2>/dev/null || \
  echo "    (无远程内容，跳过拉取)"

# 添加所有文件
echo "[4/6] 添加所有文件..."
git add .
git status --short

# 提交
echo "[5/6] 提交代码..."
git commit -m "feat(member5): complete operation ecosystem layer - Tasks 1-3

- Add personal center page with user profile, points history, activity timeline
- Add volunteer portal with task list, hour records, application form
- Add honors page with ranking board and badge collection
- Add PointsBadge, NavBar, MobileNav, UI components (button/dialog/input)
- Add Supabase client/types, hooks useUser/usePoints
- Add constants: points rules, honor levels, categories
- Add format/cn utils, project configs

Modules: profile, volunteer, honors
Author: Member 5
Date: $(date +'%Y-%m-%d')" 2>/dev/null || echo "    (没有新变更，跳过提交)"

# 推送
echo "[6/6] 推送到 GitHub..."
git push origin main

echo ""
echo "========================================="
echo "  ✅ 推送完成！"
echo "  📦 仓库地址: https://github.com/StevePan-912/kepu-platform"
echo "========================================="
echo ""
echo "请提醒其他成员执行："
echo "  git pull origin main"
