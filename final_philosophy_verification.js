#!/usr/bin/env node
const { GraphDatabase } = require('@ruvector/graph-node');

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('   PHILOSOPHY GRAPH - FINAL VERIFICATION');
  console.log('='.repeat(70) + '\n');

  const db = GraphDatabase.open('/home/user/yolo-ruvector/data/philosophy_graph.db');

  const stats = await db.stats();
  console.log('📊 GRAPH STATISTICS:');
  console.log(`   ✓ Total Nodes: ${stats.totalNodes}`);
  console.log(`   ✓ Total Edges: ${stats.totalEdges}`);
  console.log(`   ✓ Average Degree: ${stats.avgDegree.toFixed(2)}`);
  console.log(`   ✓ Persistent: ${db.isPersistent()}`);
  console.log(`   ✓ Storage: ${db.getStoragePath()}\n`);

  const result = await db.query('MATCH (n) RETURN n');
  console.log('📦 ALL NODES IN GRAPH:\n');
  
  const concepts = result.nodes.filter(n => n.labels.includes('PhilosophyConcept'));
  const philosophers = result.nodes.filter(n => n.labels.includes('Philosopher'));

  console.log(`   PhilosophyConcepts (${concepts.length}):`);
  concepts.forEach((n, i) => {
    console.log(`   ${i + 1}. ${n.properties.name} - ${n.properties.branch} (${n.properties.era})`);
  });

  console.log(`\n   Philosophers (${philosophers.length}):`);
  philosophers.forEach((n, i) => {
    console.log(`   ${i + 1}. ${n.properties.name} - ${n.properties.nationality} (${n.properties.era})`);
  });

  const edgeResult = await db.query('MATCH (a)-[r]->(b) RETURN a, r, b');
  console.log(`\n🔗 ALL RELATIONSHIPS (${edgeResult.edges.length}):\n`);
  
  edgeResult.edges.forEach((edge, i) => {
    const from = edgeResult.nodes.find(n => n.id === edge.from);
    const to = edgeResult.nodes.find(n => n.id === edge.to);
    console.log(`   ${i + 1}. ${from?.properties?.name || edge.from} -[${edge.edgeType}]-> ${to?.properties?.name || edge.to}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('   ✅ PHILOSOPHY GRAPH VERIFICATION COMPLETE!');
  console.log('='.repeat(70) + '\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
