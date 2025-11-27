#!/usr/bin/env node
const { GraphDatabase } = require('@ruvector/graph-node');

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('   PHILOSOPHY GRAPH NETWORK VERIFICATION - AGENT 6 OF 15');
  console.log('='.repeat(70) + '\n');

  try {
    // Initialize graph database (it uses default storage)
    const db = new GraphDatabase();

    // Get graph statistics
    console.log('📊 Graph Database Statistics:\n');
    try {
      const stats = await db.stats();
      console.log(`   • Total Nodes: ${stats.totalNodes}`);
      console.log(`   • Total Edges: ${stats.totalEdges}`);
      console.log(`   • Average Degree: ${stats.avgDegree.toFixed(2)}`);
      console.log(`   • Persistent: ${db.isPersistent()}`);
      const storagePath = db.getStoragePath();
      if (storagePath) {
        console.log(`   • Storage Path: ${storagePath}`);
      }
    } catch (e) {
      console.log(`   ⚠ Stats error: ${e.message}`);
    }

    // Try to query all nodes
    console.log('\n🔍 Querying all PhilosophyConcept nodes...');
    try {
      const result = await db.query('MATCH (c:PhilosophyConcept) RETURN c');
      console.log(`   ✓ Found ${result.nodes ? result.nodes.length : 0} PhilosophyConcept nodes\n`);

      if (result.nodes && result.nodes.length > 0) {
        result.nodes.forEach((node, index) => {
          console.log(`   ${index + 1}. ${node.properties?.name || 'Unknown'}`);
          console.log(`      Branch: ${node.properties?.branch || 'N/A'}`);
          console.log(`      Era: ${node.properties?.era || 'N/A'}`);
          console.log(`      Labels: ${node.labels.join(', ')}`);
        });
      }
    } catch (e) {
      console.log(`   ⚠ Query error: ${e.message}`);
    }

    console.log('\n🔍 Querying all Philosopher nodes...');
    try {
      const result = await db.query('MATCH (p:Philosopher) RETURN p');
      console.log(`   ✓ Found ${result.nodes ? result.nodes.length : 0} Philosopher nodes\n`);

      if (result.nodes && result.nodes.length > 0) {
        result.nodes.forEach((node, index) => {
          console.log(`   ${index + 1}. ${node.properties?.name || 'Unknown'}`);
          console.log(`      Era: ${node.properties?.era || 'N/A'}`);
          console.log(`      Nationality: ${node.properties?.nationality || 'N/A'}`);
          console.log(`      Labels: ${node.labels.join(', ')}`);
        });
      }
    } catch (e) {
      console.log(`   ⚠ Query error: ${e.message}`);
    }

    console.log('\n🔍 Querying all relationships...');
    try {
      const result = await db.query('MATCH (n1)-[r]->(n2) RETURN n1, r, n2');
      console.log(`   ✓ Found ${result.edges ? result.edges.length : 0} relationships\n`);

      if (result.edges && result.edges.length > 0) {
        result.edges.forEach((edge, index) => {
          const fromNode = result.nodes.find(n => n.id === edge.from);
          const toNode = result.nodes.find(n => n.id === edge.to);
          const fromName = fromNode?.properties?.name || edge.from;
          const toName = toNode?.properties?.name || edge.to;
          console.log(`   ${index + 1}. ${fromName} -[${edge.edgeType}]-> ${toName}`);
        });
      }
    } catch (e) {
      console.log(`   ⚠ Query error: ${e.message}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('   ✅ PHILOSOPHY GRAPH VERIFICATION COMPLETE!');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
