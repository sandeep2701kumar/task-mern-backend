# use the official Node.js 18 image as the base image
FROM node:18    

# set the working directory in the container
WORKDIR /app

# copy the application files to the working directory
COPY . /app

# install the application dependencies
RUN npm install

EXPOSE 8000
# Define the entry point for the container
CMD ["npm", "start"]