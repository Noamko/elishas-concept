# SSL certificates

Put your certificate files in this directory (PEM format):

| File            | What it is                        |
|-----------------|-----------------------------------|
| `fullchain.pem` | Certificate + intermediate chain  |
| `privkey.pem`   | Private key                       |

Then follow the steps at the top of `nginx/ssl.conf.template`.

**Never commit these files to git** — this directory is already git-ignored (except this README).

## Getting a free certificate (Let's Encrypt)

On the server, after the domain's DNS already points to it:

```bash
# stop the site briefly so certbot can use port 80
docker compose down
sudo certbot certonly --standalone -d elishasconcept.co.il -d www.elishasconcept.co.il
sudo cp /etc/letsencrypt/live/elishasconcept.co.il/fullchain.pem certs/
sudo cp /etc/letsencrypt/live/elishasconcept.co.il/privkey.pem certs/
docker compose up -d
```

Let's Encrypt certificates expire every 90 days — renew with `sudo certbot renew`,
copy the renewed files here again, and run `docker compose restart`.

Alternatively, if your hosting provider issues certificates for you, just drop the
two PEM files here under the same names.
