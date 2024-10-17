function setup(): string {
	if (!Deno.env.get("CLOUDFLARE_WORKER_URL")) {
		console.error("CLOUDFLARE_WORKER_URL is not set");
		Deno.exit(1);
	}
	if (!Deno.env.get("TELEGRAM_ID")) {
		console.error("TELEGRAM_ID is not set");
		Deno.exit(1);
	}

	const cronInterval = Deno.env.get("CRON_INTERVAL") || "*/10 * * * *";

	if (cronInterval !== "*/10 * * * *") {
		console.warn(
			`CRON_INTERVAL is set to NON default value of ${cronInterval}`,
		);
	}

	return cronInterval;
}

const cronInterval = setup();

async function checkServices(): Promise<{ [key: string]: string }> {
	const statuses: { [key: string]: string } = {};

	for (const [key, value] of Object.entries(Deno.env.toObject())) {
		if (key.startsWith("HCG_")) {
			const serviceName = key.slice(4); // Remove "HCG_" prefix
			try {
				const response = await fetch(value as string);
				statuses[serviceName] = response.ok ? "✅" : "❌ Down";
			} catch (error) {
				statuses[serviceName] = "❌ Down";
			}
		}
	}
	return statuses;
}

function formatStatusesMarkdown(statuses: { [key: string]: string }): string {
	let markdown = "Service Status\n\n";
	for (const [service, status] of Object.entries(statuses)) {
		markdown += `- ${service}: ${status}\n`;
	}
	return markdown;
}

async function main(): Promise<void> {
	const statuses = await checkServices();
	const markdownResponse = formatStatusesMarkdown(statuses);
	await fetch(Deno.env.get("CLOUDFLARE_WORKER_URL"), {
		method: "POST",
		body: JSON.stringify({
			telegram_id: Deno.env.get("TELEGRAM_ID"),
			status: markdownResponse,
		}),
	});
}

Deno.cron("Health Check", cronInterval, async () => {
	console.log("[HEALTH CHECK] Running...");
	await main();
});
