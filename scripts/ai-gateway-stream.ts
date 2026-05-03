import { config } from 'dotenv';
import { streamText } from 'ai';

config({ path: '.env.local', quiet: true });
config({ path: '.env', quiet: true });

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    console.error(
      'Missing AI_GATEWAY_API_KEY. Add it to .env.local (e.g. from Vercel AI Gateway or `vercel env pull`).',
    );
    process.exit(1);
  }

  const result = streamText({
    model: 'openai/gpt-5.4',
    prompt: 'Reply with one short sentence confirming the gateway works.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
  process.stdout.write('\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
