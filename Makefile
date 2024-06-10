
version = 0.1.5

git pull

# npm run build

docker build -t quant_fe_pre:$(version) .

docker stop $(docker ps -f 'name=quant_fe_pre_container' -q)

docker run -d --name quant_fe_pre_container   -p   3001:3001 quant_fe_pre:$(version)