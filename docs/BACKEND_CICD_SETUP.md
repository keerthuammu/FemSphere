# 🌸 FemSphere Backend CI/CD Pipeline Setup Guide

This document outlines the Continuous Integration (CI) and Continuous Deployment (CD) pipeline configured for the **FemSphere REST API Backend**.

---

## 1. Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │ Developer Pushes Code to GitHub Repo │
                      └──────────────────┬───────────────────┘
                                         │
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │ 🧪 GitHub Actions: Backend CI Workflow          │
                 │ 1. Setup Node.js v20 LTS                        │
                 │ 2. Spin up PostgreSQL 16 Service Container      │
                 │ 3. Execute `schema.sql` (Tables & Sequences)    │
                 │ 4. Seed Reference Data (`seed_demo_data.js`)    │
                 │ 5. Start API Server & Probe `/api/health`       │
                 │ 6. Run Automated Tests (Unit, E2E, Smartwatch)  │
                 │ 7. Build Docker Image (`Dockerfile.backend`)    │
                 └───────────────────────┬─────────────────────────┘
                                         │ Passes on `main`
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │ 🚀 GitHub Actions: Backend CD Workflow          │
                 │ 1. Publish Docker Container to GHCR             │
                 │ 2. SSH into AWS EC2 Production Server           │
                 │ 3. Pull latest Git changes & Rebuild Docker     │
                 │ 4. Graceful Container Restart                   │
                 │ 5. Automated Health Probe (`/api/health`)       │
                 └─────────────────────────────────────────────────┘
```

---

## 2. Configured Workflows

| Workflow File | Trigger Events | Purpose |
| :--- | :--- | :--- |
| [`.github/workflows/backend-ci.yml`](../.github/workflows/backend-ci.yml) | `push` or `pull_request` affecting backend files | Tests code, database migrations, sequence integrity, API endpoints, and Docker container build. |
| [`.github/workflows/backend-cd.yml`](../.github/workflows/backend-cd.yml) | Successful completion of CI on `main` or manual `workflow_dispatch` | Publishes container to GHCR, deploys to AWS EC2 via SSH, and verifies production health. |

---

## 3. GitHub Secrets Configuration

To enable automated zero-touch deployment to your AWS EC2 production server, add the following secrets to your GitHub repository:

1. Open your repository on GitHub: **`https://github.com/keerthuammu/FemSphere`**
2. Go to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** and add:

| Secret Name | Required | Example / Description |
| :--- | :---: | :--- |
| `EC2_HOST` | **Yes** | Your AWS EC2 Public IPv4 address or DNS (e.g. `54.198.24.112` or `api.femsphere.me`) |
| `EC2_USER` | **Yes** | The SSH user for your EC2 instance (usually `ubuntu` for Ubuntu AMIs) |
| `EC2_SSH_KEY` | **Yes** | The entire text of your `.pem` SSH private key (including `-----BEGIN RSA PRIVATE KEY-----`) |
| `PRODUCTION_URL` | Optional | `https://api.femsphere.me` (Used by CD to perform external health probes) |

> [!NOTE]
> `GITHUB_TOKEN` is automatically provided by GitHub Actions with permissions to publish container images to **GitHub Container Registry (GHCR)**.

---

## 4. Triggering Deployments Manually

You can trigger a deployment at any time from the GitHub UI:
1. Navigate to **Actions** in your GitHub repository.
2. Select **FemSphere Backend CD Deployment** in the left sidebar.
3. Click **Run workflow** > select branch `main` > click **Run workflow**.

---

## 5. Local Docker Testing

To test the backend container locally prior to pushing:
```bash
# Build backend container locally
docker compose build backend

# Launch PostgreSQL and Backend
docker compose up -d postgres backend

# Verify health check
curl http://localhost:5001/api/health
```
