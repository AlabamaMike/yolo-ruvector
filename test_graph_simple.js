#!/usr/bin/env node

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'test-graph.db');

console.log('\nTesting simple graph operations...\n');

async function test() {
  try {
    // Create a new database
    const db = new GraphDatabase({
      storagePath: dbPath,
      dimensions: 384,
      distanceMetric: 'Cosine'
    });

    console.log('✓ Database created');
    console.log(`  Storage: ${db.getStoragePath()}`);
    console.log(`  Persistent: ${db.isPersistent()}\n`);

    // Create a simple node
    const emptyEmbedding = new Float32Array(384).fill(0.1);

    console.log('Creating test node...');
    const nodeId = await db.createNode({
      id: 'test1',
      embedding: emptyEmbedding,
      labels: ['Person'],
      properties: { name: 'Alice', age: '30' }
    });

    console.log(`✓ Node created with ID: ${nodeId}\n`);

    // Try to query it back
    console.log('Querying for all nodes...');
    const result = db.querySync('MATCH (n) RETURN n');

    console.log(`  Nodes found: ${result.nodes.length}`);
    console.log(`  Edges found: ${result.edges.length}`);

    if (result.nodes.length > 0) {
      console.log('\n  Node details:');
      result.nodes.forEach(node => {
        console.log(`    ID: ${node.id}`);
        console.log(`    Labels: ${node.labels.join(', ')}`);
        console.log(`    Properties:`, node.properties);
      });
    }

    // Create another node and an edge
    console.log('\nCreating second node...');
    const node2Id = await db.createNode({
      id: 'test2',
      embedding: emptyEmbedding,
      labels: ['Person'],
      properties: { name: 'Bob', age: '25' }
    });
    console.log(`✓ Node created with ID: ${node2Id}`);

    console.log('\nCreating edge between nodes...');
    const edgeId = await db.createEdge({
      from: 'test1',
      to: 'test2',
      description: 'KNOWS',
      embedding: emptyEmbedding
    });
    console.log(`✓ Edge created with ID: ${edgeId}\n`);

    // Query again
    console.log('Querying graph again...');
    const result2 = db.querySync('MATCH (n) RETURN n');
    console.log(`  Nodes: ${result2.nodes.length}`);
    console.log(`  Edges: ${result2.edges.length}`);

    const edgeResult = db.querySync('MATCH (a)-[r]->(b) RETURN a, r, b');
    console.log(`  Relationships: ${edgeResult.edges.length}\n`);

    if (edgeResult.edges.length > 0) {
      console.log('  Relationship details:');
      edgeResult.edges.forEach(edge => {
        console.log(`    ${edge.from} --[${edge.edgeType}]--> ${edge.to}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

test();
