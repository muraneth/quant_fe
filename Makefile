
version = 0.0.1

git pull

npm run build

docker build -t quant_fe_pre:$(version) .

docker stop $(docker ps -a -q)

docker run -d -p 3001:3001 quant_fe_pre:$(version)