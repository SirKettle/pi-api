# pi-api

A locally hosted node server running on a raspberry PI 4

- pi-api node server running locally on raspberry pi (on ports 80 and 443)
- Using pm2 to run node in background

Useful reading: [set up a self-booting node.js server on a raspberry pi 3 using pm2](https://medium.com/@andrew.nease.code/set-up-a-self-booting-node-js-eb56ebd05549)

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

### Potential issues
If node server fails to run - make sure lower ports are able to be run by non root user (ie if get error on port 80 when running `node dist/index.js`). If this happens, run the following command:
```
sudo setcap 'cap_net_bind_service=+ep' `which node`
```


### DynDns

Dynamic DNS handled by https://www.dynu.com/en-US/ControlPanel/DDNS with a cron job running every 5m on raspberry pi
https://www.dynu.com/DynamicDNS/IPUpdateClient/RaspberryPi-Dynamic-DNS
