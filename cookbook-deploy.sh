# cd "$(dirname "$0")";
# npm run build
docker build -t stream-notifier .
docker-compose up -d --remove-orphans --force-recreate
# docker image prune -f
