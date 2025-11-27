#!/usr/bin/env node

/**
 * View Science Knowledge Graph
 * Displays the science knowledge network in a detailed report
 */

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'science_graph.db');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('         SCIENCE KNOWLEDGE GRAPH - COMPLETE REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

try {
  const db = new GraphDatabase(dbPath);

  console.log('🔬 SCIENCE CONCEPTS BY FIELD:\n');
  console.log('─'.repeat(60));

  // Group concepts by field
  const fields = ['physics', 'biology', 'chemistry'];

  fields.forEach(field => {
    console.log(`\n${field.toUpperCase()}:`);
    const conceptsResult = db.query(`MATCH (c:Concept {field: '${field}'}) RETURN c.name as name, c.importance as importance`);

    // Convert iterator/stream to array
    const concepts = [];
    for (const concept of conceptsResult) {
      concepts.push(concept);
    }

    concepts.forEach(c => {
      console.log(`  • ${c.name} (importance: ${c.importance})`);
    });
  });

  console.log('\n\n👨‍🔬 PIONEERING SCIENTISTS:\n');
  console.log('─'.repeat(60));

  const scientistsResult = db.query('MATCH (s:Scientist) RETURN s.name as name, s.era as era, s.contributions as contributions ORDER BY s.name');

  const scientists = [];
  for (const scientist of scientistsResult) {
    scientists.push(scientist);
  }

  scientists.forEach(s => {
    console.log(`  • ${s.name} (${s.era})`);
    console.log(`    Contributions: ${s.contributions}`);
  });

  console.log('\n\n🔗 SCIENTIST → CONCEPT RELATIONSHIPS:\n');
  console.log('─'.repeat(60));

  const scRelResult = db.query(`
    MATCH (s:Scientist)-[r]->(c:Concept)
    RETURN s.name as scientist, type(r) as relationship, c.name as concept
    ORDER BY s.name
  `);

  const scRels = [];
  for (const rel of scRelResult) {
    scRels.push(rel);
  }

  scRels.forEach(r => {
    console.log(`  ${r.scientist} --[${r.relationship}]--> ${r.concept}`);
  });

  console.log('\n\n🌐 INTERDISCIPLINARY CONNECTIONS:\n');
  console.log('─'.repeat(60));

  const ccRelResult = db.query(`
    MATCH (c1:Concept)-[r]->(c2:Concept)
    RETURN c1.name as from, type(r) as relationship, c2.name as to, c1.field as from_field, c2.field as to_field
  `);

  const ccRels = [];
  for (const rel of ccRelResult) {
    ccRels.push(rel);
  }

  ccRels.forEach(r => {
    console.log(`  ${r.from} (${r.from_field})`);
    console.log(`    └─[${r.relationship}]─> ${r.to} (${r.to_field})`);
  });

  console.log('\n\n📊 GRAPH STATISTICS:\n');
  console.log('─'.repeat(60));

  console.log(`  Total Concepts: ${fields.reduce((sum, field) => {
    const result = db.query(`MATCH (c:Concept {field: '${field}'}) RETURN count(c) as count`);
    for (const r of result) return sum + (r.count || 0);
    return sum;
  }, 0)}`);

  console.log(`  Total Scientists: ${scientists.length}`);
  console.log(`  Scientist→Concept Links: ${scRels.length}`);
  console.log(`  Concept→Concept Links: ${ccRels.length}`);
  console.log(`  Total Relationships: ${scRels.length + ccRels.length}`);

  console.log('\n\n🎯 KEY INSIGHTS:\n');
  console.log('─'.repeat(60));

  // Find most connected concepts
  const connectionCount = {};
  scRels.forEach(r => {
    connectionCount[r.concept] = (connectionCount[r.concept] || 0) + 1;
  });
  ccRels.forEach(r => {
    connectionCount[r.from] = (connectionCount[r.from] || 0) + 1;
    connectionCount[r.to] = (connectionCount[r.to] || 0) + 1;
  });

  const sorted = Object.entries(connectionCount).sort((a, b) => b[1] - a[1]);
  console.log('  Most Connected Concepts:');
  sorted.slice(0, 3).forEach(([concept, count]) => {
    console.log(`    • ${concept}: ${count} connections`);
  });

  console.log('\n═══════════════════════════════════════════════════════════════\n');

} catch (error) {
  console.error('❌ Error viewing graph:', error.message);
  console.error('Stack:', error.stack);
}
