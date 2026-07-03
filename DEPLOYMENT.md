# Auraè — Hostinger Deployment Guide

## Prerequisites
- Hostinger Business / VPS plan (Node.js support)
- MySQL database created in Hostinger hPanel
- Domain pointed to Hostinger nameservers

---

## 1. Build the Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=https://yourdomain.com/api
# Set VITE_RAZORPAY_KEY=rzp_live_xxxxxxxx
npm install
npm run build
```

Upload the entire `frontend/dist/` folder contents to `public_html/` on Hostinger via File Manager or FTP.

---

## 2. Set Up the Backend

### Upload files
Upload the `backend/` folder to `/home/u<USER>/aurae/backend/` on the server.

### Install dependencies (SSH)
```bash
cd ~/aurae/backend
npm install --omit=dev
```

### Create .env
```bash
cp .env.example .env
nano .env   # fill in all production values
```

### Run database migrations
```bash
npm run migrate
npm run seed
```

---

## 3. Start with PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed command to enable auto-start
```

### Useful PM2 commands
```bash
pm2 logs aurae-api       # live logs
pm2 restart aurae-api    # restart
pm2 stop aurae-api       # stop
pm2 monit                # dashboard
```

---

## 4. Nginx (if Hostinger VPS)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend (React SPA)
    root /var/www/html;
    index index.html;

    # API proxy → Node.js
    location /api/ {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads/ {
        alias /home/u<USER>/aurae/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### SSL certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 5. Post-deployment checklist

- [ ] `.env` has all production values (real Razorpay live keys, SMTP, strong JWT secrets)
- [ ] `NODE_ENV=production` is set
- [ ] Database migrated and seeded
- [ ] Admin user password changed from default
- [ ] SSL certificate active (HTTPS)
- [ ] PM2 set to restart on reboot (`pm2 startup`)
- [ ] Upload directory writable by Node process
- [ ] CORS `FRONTEND_URL` matches live domain
- [ ] Razorpay webhook URL configured in Razorpay dashboard

---

## 6. Environment variables reference

See `backend/.env.example` for all required variables.

**Critical production values to change:**
- `JWT_SECRET` — use `openssl rand -hex 64`
- `JWT_REFRESH_SECRET` — use `openssl rand -hex 64`
- `DB_PASSWORD` — your MySQL password from hPanel
- `SMTP_PASS` — Gmail App Password (not your Gmail login)
- `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` — switch to live keys
- `FRONTEND_URL` — `https://yourdomain.com`
