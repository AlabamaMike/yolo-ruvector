#!/usr/bin/env node
const { GraphDatabase } = require('@ruvector/graph-node');

async function testPersistence() {
  console.log('\n=== Testing GraphDatabase Persistence ===\n');

  const dbPath = '/home/user/yolo-ruvector/data/test_graph.db';
  console.log(`Creating database at: ${dbPath}`);

  // Create database with persistence
  const db = new GraphDatabase({
    distanceMetric: 'Cosine',
    dimensions: 384,
    storagePath: dbPath
  });

  console.log(`Persistent: ${db.isPersistent()}`);
  console.log(`Storage Path: ${db.getStoragePath()}\n`);

  // Create a simple node
  console.log('Creating test node...');
  const embedding = new Float32Array(384).fill(0.1);
  
  const nodeId = await db.createNode({
    id: 'test-node-1',
    embedding: embedding,
    labels: ['TestNode'],
    properties: { name: 'Test', value: '123' }
  });

  console.log(`Node created with ID: ${nodeId}\n`);

  // Query immediately
  console.log('Querying in same session...');
  let result = await db.query('MATCH (n:TestNode) RETURN n');
  console.log(`Nodes found: ${result.nodes.length}\n`);

  if (result.nodes.length > 0) {
    console.log(`Node properties:`, result.nodes[0].properties);
  }

  // Get stats
  const stats = await db.stats();
  console.log(`\nGraph stats: ${stats.totalNodes} nodes, ${stats.totalEdges} edges\n`);

  console.log('=== Test Complete ===\n');
}

testPersistence().catch(err => {
  console.error('Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
