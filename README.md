# HealthCheckGram

HealthCheckGram is a service that performs health checks on specified endpoints and sends status updates via Telegram.

> [!NOTE] 
> I will be using cloudflare worker nodes to send the messages since they're free for 100,000 requests a day. Unfortunately, if there is abuse, I will be forced to take it down. You can follow the code and steps outlined in `cloudflare-worker` to deploy your own worker on the [edge](https://developers.cloudflare.com/workers/)

### Rationale
I created HealthCheckGram for quick service updates without a full healthcheck workflow. It's particularly useful for homelab monitoring/non-critical systems, providing fast uptime stats and downtime notifications. Also since deno v2 just released at the time of writing, it seemed cool to try it out.

> [!WARNING] 
> Since this is running on a cron timer, it might not notify you immediately so expect some lag time. **DO NOT USE THIS FOR MISSION CRITICAL SYSTEMS**


## Environment Variables

The following environment variables are used to configure the application:

| Environment Variable | Description |
|----------------------|-------------|
| `CLOUDFLARE_WORKER_URL` | URL of the Cloudflare Worker that handles sending messages to Telegram. |
| `TELEGRAM_ID` | Your Telegram user ID or chat ID where the status updates will be sent. |
| `CRON_INTERVAL` | The interval at which health checks are performed. Default is "*/10 * * * *" (every 10 minutes). |
| `TELEGRAM_BOT_TOKEN` | Your Telegram Bot Token (used in the Cloudflare Worker). |
| `HCG_*` | Any environment variable starting with "HCG_" will be treated as a service to check. The name after "HCG_" will be used as the service name, and the value should be the URL to check. |

Example of a service health check variable:
- `HCG_FRONTEND`: "<docker_dns_name:port>

## Recommendation
I recommend putting the env variables in your `docker-compose.yml` directly so it only affects the container running the healthchecks.

## Cloudflare Worker Configuration

The Cloudflare Worker uses the following configuration:

- `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token (set in wrangler.toml)

## Docker Compose Configuration

When using docker-compose, you can set the following environment variables:

- `CLOUDFLARE_WORKER_URL`
- `TELEGRAM_ID`
- `CRON_INTERVAL`
- `HCG_FRONTEND` (example service)

Make sure to set these variables in your environment or in a `.env` file before running the Docker container.

## Usage
- Onboard yourself @HealthCheckGramBot <img src="https://github.com/user-attachments/assets/0e463238-1e43-40af-9c56-75c2fed3ab76" width="200" alt="HealthCheckGramBot onboarding">
- Retrieve your telegram ID [random article showing how](https://www.alphr.com/telegram-find-user-id/)
- Reference the built container by name `ghcr.io/xepheryy/healthcheckgram:latest`
- Use it in your compose / as a standalone docker run
- Specify the envs, health check points etc.


## Contributing

Fork this, make a PR if you want. I'll review it as and when.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license.

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

Under the following terms:
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.

For more details, see the [full license text](https://creativecommons.org/licenses/by-nc/4.0/legalcode).
