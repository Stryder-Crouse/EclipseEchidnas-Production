docker-compose -f docker-compose.public.yaml down || exit 0 # Attempt to exit the prod instance, do nothing if not
docker-compose -f docker-compose.public.yaml pull # Update containers
docker-compose -f docker-compose.public.yaml up -d # Restart
