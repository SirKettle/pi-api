# pi-api

A locally hosted node server running on a raspberry PI 4

- pi-api node server running locally on raspberry pi (on ports 80 and 443)
- Using pm2 to run node in background

### Certbot SSL certifcate

- Ssl certification by letsencrypt/certbot. Needs to be renewed every 90 days. TODO - renew with cron job
- To manually renew certs:

Stop the server (so that certbot can run a temp one on port 80 to create challenge)
```
pm2 stop all
```

Manually recreate cert and then change owner to pi
```
sudo certbot certonly --standalone -d sirkettle.kozow.com
sudo chown pi -R /etc/letsencrypt
```

Restart the server
```
pm2 start all
```

### DynDns

Dynamic DNS handled by https://www.dynu.com/en-US/ControlPanel/DDNS with a cron job running every 5m on raspberry pi
https://www.dynu.com/DynamicDNS/IPUpdateClient/RaspberryPi-Dynamic-DNS
