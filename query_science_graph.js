#!/usr/bin/env node

/**
 * Query Science Knowledge Graph
 * Shows the science knowledge network created with ruvector graph
 */

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'ruvector.db');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('           SCIENCE KNOWLEDGE GRAPH REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

try {
  const db = new GraphDatabase(dbPath);

  // Query all Concept nodes
  console.log('🔬 SCIENCE CONCEPTS:\n');
  console.log('─'.repeat(60));
  const conceptsQuery = 'MATCH (n:Concept) RETURN n';
  const concepts = db.query(conceptsQuery);
  console.log(`Found ${concepts.length || 0} concepts`);
  if (concepts.length) {
    concepts.forEach(result => {
      console.log(`  • ${JSON.stringify(result)}`);
    });
  }

  // Query all Scientist nodes
  console.log('\n\n👨‍🔬 SCIENTISTS:\n');
  console.log('─'.repeat(60));
  const scientistsQuery = 'MATCH (n:Scientist) RETURN n';
  const scientists = db.query(scientistsQuery);
  console.log(`Found ${scientists.length || 0} scientists`);
  if (scientists.length) {
    scientists.forEach(result => {
      console.log(`  • ${JSON.stringify(result)}`);
    });
  }

  // Query all relationships between scientists and concepts
  console.log('\n\n🔗 SCIENTIST → CONCEPT RELATIONSHIPS:\n');
  console.log('─'.repeat(60));
  const relationshipsQuery = 'MATCH (s:Scientist)-[r]->(c:Concept) RETURN s, r, c';
  const relationships = db.query(relationshipsQuery);
  console.log(`Found ${relationships.length || 0} relationships`);
  if (relationships.length) {
    relationships.forEach(result => {
      console.log(`  • ${JSON.stringify(result)}`);
    });
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n');

  db.close();
} catch (error) {
  console.error('Error querying graph:', error.message);
  console.error('Stack:', error.stack);
}
