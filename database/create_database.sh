docker pull postgres:9.6
docker run --name oe_db --expose 5432 -p 5432:5432 -e POSTGRES_PASSWORD=oe_password -e POSTGRES_USER=oe_admin -e POSTGRES_DB=oe_db_dev -d postgres