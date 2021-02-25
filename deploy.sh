cd /var/www/abjad-api
rm schema.gql
rm package-lock.json
rm yarn.lock
git pull origin master
npm i
npm run build
pm2 restart abjad-api
