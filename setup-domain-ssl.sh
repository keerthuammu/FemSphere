#!/bin/bash
# ==============================================================================
# 🌸 FemSphere - AWS EC2 Domain & Free SSL (Certbot + Nginx) Setup Script
# Usage: sudo ./setup-domain-ssl.sh yourdomain.com [optional_email]
# ==============================================================================

set -e

DOMAIN_NAME=$1
ADMIN_EMAIL=$2

if [ -z "$DOMAIN_NAME" ]; then
  echo "❌ Error: Please provide your domain name."
  echo "👉 Example usage: sudo ./setup-domain-ssl.sh api.femsphere.health user@example.com"
  exit 1
fi

echo "🚀 [1/4] Installing Nginx and Certbot (Let's Encrypt)..."
sudo apt-get update -y
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "⚙️ [2/4] Configuring Nginx reverse proxy for domain: $DOMAIN_NAME..."

# Create Nginx server configuration pointing to port 5001
sudo tee /etc/nginx/sites-available/$DOMAIN_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Maximum file upload size for medical records (15MB)
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site and test configuration
sudo ln -sf /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "🔒 [3/4] Requesting free Let's Encrypt SSL certificate for HTTPS..."
if [ -n "$ADMIN_EMAIL" ]; then
  sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $ADMIN_EMAIL --redirect
else
  sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --register-unsafely-without-email --redirect
fi

echo "✅ [4/4] Testing Nginx and SSL certificate auto-renewal..."
sudo systemctl reload nginx
sudo certbot renew --dry-run

echo ""
echo "=============================================================================="
echo "🎉 SUCCESS: Domain Connected with Free HTTPS SSL!"
echo "🌐 Live Backend URL: https://$DOMAIN_NAME"
echo "🩺 Health Check:     https://$DOMAIN_NAME/api/health"
echo "=============================================================================="
