up:
	docker-compose up
makemigrations:
	docker exec -it backend python manage.py makemigrations
	docker exec -it backend python manage.py migrate
migrate:
	docker exec -it backend python manage.py migrate
	docker exec -it backend python manage.py loaddata fixtures/data.json
build:
	docker-compose up --no-start --remove-orphans --build
start:
	docker-compose start
stop:
	docker-compose stop
dumpdata:
	docker exec -it backend python manage.py dumpdata > backend-app/fixtures/data.json -e contenttypes -e auth.Permission

