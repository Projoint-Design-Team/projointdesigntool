# Use a base image
FROM python:3.9.7-buster

# Create the necessary directory structure
RUN mkdir -p /home/app/docs

# Set the working directory
WORKDIR /home/app/

# Copy the docs directory contents
COPY . .

RUN chmod -R 755 /home/app/docs
RUN chmod -R 755 /home/app/docs/api_requests.log
