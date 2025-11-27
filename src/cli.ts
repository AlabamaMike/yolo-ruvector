#!/usr/bin/env node
/**
 * AI Knowledge Universe CLI
 * Query across science, technology, and philosophy domains
 */

import { orchestrator } from './orchestrator';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const query = args.slice(1).join(' ');

  console.log('🌌 AI Knowledge Universe');
  console.log('========================\n');

  switch (command) {
    case 'search':
      console.log(`Searching: "${query}"\n`);
      const results = await orchestrator.search(query);
      console.log('Results:', JSON.stringify(results, null, 2));
      break;

    case 'multi':
      console.log(`Multi-domain search: "${query}"\n`);
      const multiResults = await orchestrator.multiDomainSearch(query);
      console.log('Results:', JSON.stringify(multiResults, null, 2));
      break;

    case 'connect':
      const [concept1, concept2] = query.split(' -> ');
      console.log(`Finding connections: ${concept1} -> ${concept2}\n`);
      const paths = await orchestrator.findConnections(concept1, concept2);
      console.log('Paths:', paths);
      break;

    default:
      console.log('Usage:');
      console.log('  search <query>     - Smart routed search');
      console.log('  multi <query>      - Search all domains');
      console.log('  connect <a> -> <b> - Find concept connections');
  }
}

main().catch(console.error);
