# Use the official Deno image as the base
FROM denoland/deno:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the local code to the container
COPY ./src/ .

# Run the script
CMD ["deno", "--env", "--allow-net", "--allow-env", "--unstable-cron", "main.ts"]

