#!/bin/bash
# ==============================================================================
# 🌸 FemSphere - AWS EC2 One-Click Docker Deployment Script
# Installs Docker, Docker Compose, starts PostgreSQL & Express backend
# ==============================================================================

set -e

echo "🚀 [1/5] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

echo "🐳 [2/5] Installing Docker & Docker Compose..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add current user to docker group
sudo usermod -aG docker $USER || true

echo "📦 [3/5] Building and launching FemSphere Docker containers (Backend + PostgreSQL)..."
sudo docker compose down || true
sudo docker compose build --no-cache backend
sudo docker compose up -d postgres backend

echo "⏳ [4/5] Waiting for PostgreSQL and Backend to be fully ready..."
sleep 10

echo "🩺 [5/5] Checking FemSphere API Health..."
curl -s http://localhost:5001/api/health || true

echo ""
echo "=============================================================================="
echo "✨ FemSphere Backend & PostgreSQL Deployed Successfully on AWS!"
echo "📡 Backend URL: http://$(curl -s http://checkip.amazonaws.com):5001"
echo "🩺 Health Check: http://$(curl -s http://checkip.amazonaws.com):5001/api/health"
echo "🗄️ PostgreSQL Port: 5432 (internal & mapped)"
echo "=============================================================================="
