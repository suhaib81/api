# Installation

### Install Docker
https://docs.docker.com/engine/installation/

### Start postgres environment with correct variables.
```
sh database.sh
```

### Test if is working
This requires psql to be installed
```
docker run -it --rm --link oe_db:postgres postgres psql -h oe_db -U oe_admin -d oe_db_dev
```
with password `oe_password`