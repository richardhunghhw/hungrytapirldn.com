/**
 * Run locally to dump all content from Cloudflare KV into
 * server/content/{type}.json files for use with USE_LOCAL_CONTENT=true.
 *
 * Prerequisites:
 *   npx wrangler login   (or set CLOUDFLARE_API_TOKEN in your shell)
 *
 * Usage:
 *   npx tsx scripts/export-content.ts
 *   npx tsx scripts/export-content.ts --namespace-id <id>   # explicit KV namespace
 *
 * After running:
 *   1. Review server/content/*.json
 *   2. git add server/content/*.json && git commit
 *   3. Set USE_LOCAL_CONTENT=true in Cloudflare Pages env vars (TEST first)
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const CONTENT_TYPES = ['general', 'blog', 'product', 'faq', 'stalldate'] as const;
type ContentType = typeof CONTENT_TYPES[number];

const args = process.argv.slice(2);
const envFlag = args.includes('--env') ? args[args.indexOf('--env') + 1] : undefined;
const namespaceIdFlag = args.includes('--namespace-id') ? args[args.indexOf('--namespace-id') + 1] : undefined;
const wranglerEnv = envFlag ? `--env ${envFlag}` : '';

function wrangler(cmd: string): string {
  try {
    return execSync(`npx wrangler ${cmd}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e: any) {
    throw new Error(`wrangler command failed: ${e.message}\n${e.stderr}`);
  }
}

function getNamespaceId(): string {
  if (namespaceIdFlag) return namespaceIdFlag;

  // List KV namespaces and find CONTENT_STORE
  const output = wrangler(`kv namespace list`);
  const namespaces: Array<{ id: string; title: string }> = JSON.parse(output);
  const ns = namespaces.find((n) => n.title.includes('CONTENT_STORE') || n.title.includes('content'));
  if (!ns) {
    console.error('Available namespaces:', namespaces.map((n) => `${n.title} (${n.id})`).join(', '));
    throw new Error(
      'Could not find CONTENT_STORE namespace. Pass --namespace-id <id> explicitly.',
    );
  }
  console.log(`Using namespace: ${ns.title} (${ns.id})`);
  return ns.id;
}

async function exportType(namespaceId: string, type: ContentType): Promise<any[]> {
  console.log(`  Listing keys for [${type}]...`);
  const listOutput = wrangler(`kv key list --namespace-id ${namespaceId} --prefix "${type}:" --limit 1000`);
  const keys: Array<{ name: string; metadata?: any }> = JSON.parse(listOutput);

  // Filter out computed keys like stalldate:latest
  const filtered = keys.filter((k) => {
    const slug = k.name.split(':')[1];
    return slug && slug !== 'latest';
  });

  console.log(`  Found ${filtered.length} entries for [${type}]`);

  const entries: any[] = [];
  for (const key of filtered) {
    const slug = key.name.split(':')[1];
    console.log(`    Fetching ${key.name}...`);
    const valueOutput = wrangler(`kv key get --namespace-id ${namespaceId} "${key.name}" --text`);
    let data: any;
    try {
      data = JSON.parse(valueOutput.trim());
    } catch {
      console.warn(`    Warning: could not parse value for ${key.name}, skipping`);
      continue;
    }

    entries.push({
      type,
      slug,
      metadata: key.metadata ?? {},
      data,
    });
  }

  return entries;
}

async function main() {
  console.log('Hungry Tapir — Content Export Script');
  console.log('=====================================');

  const namespaceId = getNamespaceId();
  const outputDir = join(process.cwd(), 'server', 'content');
  mkdirSync(outputDir, { recursive: true });

  for (const type of CONTENT_TYPES) {
    console.log(`\nExporting [${type}]...`);
    try {
      const entries = await exportType(namespaceId, type);
      const outputPath = join(outputDir, `${type}.json`);
      writeFileSync(outputPath, JSON.stringify(entries, null, 2));
      console.log(`  ✓ Written to server/content/${type}.json (${entries.length} entries)`);
    } catch (err: any) {
      console.error(`  ✗ Failed to export [${type}]: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n✓ Export complete. Review server/content/*.json then commit.');
  console.log('  Set USE_LOCAL_CONTENT=true in Cloudflare Pages env vars to activate.\n');
}

main();
