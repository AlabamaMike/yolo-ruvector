#!/usr/bin/env node
const { GraphDatabase } = require('@ruvector/graph-node');
const fs = require('fs');

async function main() {
  const dbPath = '/home/user/yolo-ruvector/data/philosophy_graph.db';
  
  console.log('\n=== Checking Philosophy Graph Database ===\n');
  console.log(`Database path: ${dbPath}`);
  console.log(`File exists: ${fs.existsSync(dbPath)}`);
  
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB\n`);
  }

  // Try opening the database
  console.log('Opening database...');
  const db = GraphDatabase.open(dbPath);
  
  console.log(`Persistent: ${db.isPersistent()}`);
  console.log(`Storage Path: ${db.getStoragePath()}\n`);

  // Get stats
  const graphStats = await db.stats();
  console.log('Graph Statistics:');
  console.log(`  Total Nodes: ${graphStats.totalNodes}`);
  console.log(`  Total Edges: ${graphStats.totalEdges}`);
  console.log(`  Average Degree: ${graphStats.avgDegree.toFixed(2)}\n`);

  // Try querying
  console.log('Attempting to query all nodes...');
  const result = await db.query('MATCH (n) RETURN n');
  console.log(`Query result - Nodes: ${result.nodes.length}, Edges: ${result.edges.length}\n`);

  console.log('=== Check Complete ===\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
