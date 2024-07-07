#!/bin/bash

# Pull the latest image
docker pull manaconnan/quant_fe_pre:0.2.3_position

# Stop and remove the existing container if it exists
docker stop matrix_fe_container || true
docker rm matrix_fe_container || true

# Run the container with the latest image
docker run -d --name matrix_fe_container -p 3002:3001 manaconnan/quant_fe_pre:0.2.3_position
