/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	TELEGRAM_BOT_TOKEN: string;
}

interface RequestBody {
	telegram_id: string;
	status: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		if (request.method !== "POST") {
			return new Response("Method Not Allowed", { status: 405 });
		}

		try {
			const body: RequestBody = await request.json();

			if (!body.telegram_id || !body.status) {
				return new Response("Missing required fields", { status: 400 });
			}

			// Code inspired by https://gist.github.com/dideler/85de4d64f66c1966788c1b2304b9caf1
			const telegramResponse = await fetch(
				`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						chat_id: body.telegram_id,
						text: body.status,
						parse_mode: "Markdown",
						disable_notification: true,
					}),
				},
			);

			if (!telegramResponse.ok) {
				throw new Error("Failed to send message to Telegram");
			}

			return new Response("Message sent to Telegram", { status: 200 });
		} catch (error) {
			console.error("Error:", error);
			return new Response("Internal Server Error", { status: 500 });
		}
	},
};
