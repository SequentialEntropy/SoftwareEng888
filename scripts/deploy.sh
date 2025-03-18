#!/bin/bash

# Stop server
sudo systemctl stop SoftwareEng888-frontend.service
sudo systemctl stop SoftwareEng888-backend.service

# Pull and apply latest changes
cd /root/SoftwareEng888
git stash
git checkout main
git pull --no-edit origin main
sudo chmod 755 /root/SoftwareEng888/scripts/deploy.sh

# Install any new python packages
source ./venv/bin/activate
python3 -m pip install -r requirements.txt

# Apply new migrations
cd backend
python3 manage.py makemigrations
python3 manage.py migrate

# Install any new node packages
cd ../application
npm install

# Start server
sudo systemctl start SoftwareEng888-frontend.service
sudo systemctl start SoftwareEng888-backend.service