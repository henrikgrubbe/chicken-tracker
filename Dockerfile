# Stage 1: Compile and build Vue app

# Use official node image as the base image
FROM node:19-alpine as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app

# Install all dependencies
RUN npm ci --quiet

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app

# Lightweight http server written in Go
FROM pierrezemb/gostatic:latest

# Copy the build output
COPY --from=build /usr/local/app/dist /srv/http

# Expose port 8043
EXPOSE 8043

# Fallback to index.html to support routing
CMD ["-fallback", "/index.html"]
