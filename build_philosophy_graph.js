#!/usr/bin/env node
const { GraphDatabase } = require('@ruvector/graph-node');
const fs = require('fs');

// Simple text-to-vector function for embeddings
function textToVector(text, dimensions = 384) {
  const vector = new Array(dimensions).fill(0);

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const idx = (charCode * (i + 1)) % dimensions;
    vector[idx] += Math.sin(charCode + i) * 0.1;
  }

  const words = text.split(' ');
  for (let i = 0; i < dimensions; i++) {
    vector[i] += Math.sin(words.length * i * 0.01) * 0.05;
    vector[i] += Math.cos(text.length * i * 0.001) * 0.05;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(v => magnitude > 0 ? v / magnitude : 0);
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('   PHILOSOPHY GRAPH NETWORK - AGENT 6 OF 15');
  console.log('='.repeat(70) + '\n');

  try {
    const dbPath = '/home/user/yolo-ruvector/data/philosophy_graph.db';
    console.log('📦 Step 1: Creating graph database with persistence...');

    const db = new GraphDatabase({
      distanceMetric: 'Cosine',
      dimensions: 384,
      storagePath: dbPath
    });

    console.log(`   ✓ Database created at: ${dbPath}`);
    console.log(`   • Persistent: ${db.isPersistent()}`);
    console.log(`   • Dimensions: 384\n`);

    // Step 2: Create PhilosophyConcept nodes
    console.log('📚 Step 2: Creating PhilosophyConcept nodes...');

    const concepts = [
      { name: "Utilitarianism", branch: "ethics", era: "modern" },
      { name: "Deontology", branch: "ethics", era: "enlightenment" },
      { name: "Existentialism", branch: "metaphysics", era: "20th century" },
      { name: "Empiricism", branch: "epistemology", era: "enlightenment" },
      { name: "Rationalism", branch: "epistemology", era: "enlightenment" },
      { name: "Phenomenology", branch: "metaphysics", era: "20th century" },
      { name: "Pragmatism", branch: "epistemology", era: "modern" },
      { name: "Virtue Ethics", branch: "ethics", era: "ancient" }
    ];

    const conceptIds = {};
    for (const concept of concepts) {
      const embedding = textToVector(`${concept.name} ${concept.branch} ${concept.era}`);
      const nodeId = await db.createNode({
        id: concept.name,
        embedding: new Float32Array(embedding),
        labels: ['PhilosophyConcept'],
        properties: concept
      });
      conceptIds[concept.name] = nodeId;
      console.log(`   ✓ Created: ${concept.name} (${concept.branch})`);
    }

    console.log(`\n   Total PhilosophyConcepts created: ${concepts.length}\n`);

    // Step 3: Create Philosopher nodes
    console.log('👤 Step 3: Creating Philosopher nodes...');

    const philosophers = [
      { name: "Kant", era: "enlightenment", nationality: "German" },
      { name: "Nietzsche", era: "19th century", nationality: "German" },
      { name: "Sartre", era: "20th century", nationality: "French" },
      { name: "Hume", era: "enlightenment", nationality: "Scottish" },
      { name: "Mill", era: "19th century", nationality: "British" },
      { name: "Aristotle", era: "ancient", nationality: "Greek" },
      { name: "Husserl", era: "20th century", nationality: "German" }
    ];

    const philosopherIds = {};
    for (const philosopher of philosophers) {
      const embedding = textToVector(`${philosopher.name} ${philosopher.era} ${philosopher.nationality}`);
      const nodeId = await db.createNode({
        id: philosopher.name,
        embedding: new Float32Array(embedding),
        labels: ['Philosopher'],
        properties: philosopher
      });
      philosopherIds[philosopher.name] = nodeId;
      console.log(`   ✓ Created: ${philosopher.name} (${philosopher.nationality})`);
    }

    console.log(`\n   Total Philosophers created: ${philosophers.length}\n`);

    // Step 4: Create relationships
    console.log('🔗 Step 4: Creating philosophical relationships...');

    const relationships = [
      { from: "Kant", to: "Deontology", type: "FOUNDED" },
      { from: "Sartre", to: "Existentialism", type: "DEVELOPED" },
      { from: "Hume", to: "Empiricism", type: "CHAMPIONED" },
      { from: "Mill", to: "Utilitarianism", type: "REFINED" },
      { from: "Aristotle", to: "Virtue Ethics", type: "ORIGINATED" },
      { from: "Husserl", to: "Phenomenology", type: "CREATED" },
      { from: "Nietzsche", to: "Existentialism", type: "INFLUENCED" },
      { from: "Deontology", to: "Utilitarianism", type: "OPPOSES" },
      { from: "Empiricism", to: "Rationalism", type: "DEBATES" },
      { from: "Existentialism", to: "Phenomenology", type: "BUILDS_ON" },
      { from: "Pragmatism", to: "Empiricism", type: "SYNTHESIZES" }
    ];

    for (const rel of relationships) {
      const embedding = textToVector(`${rel.from} ${rel.type} ${rel.to}`);
      await db.createEdge({
        from: rel.from,
        to: rel.to,
        description: rel.type,
        embedding: new Float32Array(embedding),
        confidence: 0.95
      });
      console.log(`   ✓ ${rel.from} -[${rel.type}]-> ${rel.to}`);
    }

    console.log(`\n   Total relationships created: ${relationships.length}\n`);

    // Step 5: Query and display the graph
    console.log('🔍 Step 5: Querying the philosophy graph...\n');

    const stats = await db.stats();
    console.log('📊 Graph Statistics:');
    console.log(`   • Total Nodes: ${stats.totalNodes}`);
    console.log(`   • Total Edges: ${stats.totalEdges}`);
    console.log(`   • Average Degree: ${stats.avgDegree.toFixed(2)}\n`);

    console.log('📝 PhilosophyConcepts:');
    const conceptResult = await db.query('MATCH (c:PhilosophyConcept) RETURN c');
    conceptResult.nodes.forEach((node, i) => {
      console.log(`   ${i + 1}. ${node.properties.name} - ${node.properties.branch} (${node.properties.era})`);
    });

    console.log('\n👥 Philosophers:');
    const philosopherResult = await db.query('MATCH (p:Philosopher) RETURN p');
    philosopherResult.nodes.forEach((node, i) => {
      console.log(`   ${i + 1}. ${node.properties.name} - ${node.properties.nationality} (${node.properties.era})`);
    });

    console.log('\n🔗 Philosopher → Concept Relationships:');
    const relResult = await db.query('MATCH (p:Philosopher)-[r]->(c:PhilosophyConcept) RETURN p, r, c');
    relResult.edges.forEach((edge, i) => {
      const from = relResult.nodes.find(n => n.id === edge.from);
      const to = relResult.nodes.find(n => n.id === edge.to);
      console.log(`   ${i + 1}. ${from.properties.name} -[${edge.edgeType}]-> ${to.properties.name}`);
    });

    console.log('\n🔗 Concept → Concept Relationships:');
    const conceptRelResult = await db.query('MATCH (c1:PhilosophyConcept)-[r]->(c2:PhilosophyConcept) RETURN c1, r, c2');
    conceptRelResult.edges.forEach((edge, i) => {
      const from = conceptRelResult.nodes.find(n => n.id === edge.from);
      const to = conceptRelResult.nodes.find(n => n.id === edge.to);
      console.log(`   ${i + 1}. ${from.properties.name} -[${edge.edgeType}]-> ${to.properties.name}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('   ✅ PHILOSOPHY GRAPH NETWORK COMPLETE!');
    console.log('='.repeat(70) + '\n');

    console.log('📋 SUMMARY:');
    console.log(`   • Database: ${dbPath}`);
    console.log(`   • Total Nodes: ${stats.totalNodes}`);
    console.log(`   • Total Edges: ${stats.totalEdges}`);
    console.log(`   • PhilosophyConcepts: ${concepts.length}`);
    console.log(`   • Philosophers: ${philosophers.length}`);
    console.log(`   • Relationships: ${relationships.length}`);
    console.log(`   • Graph Type: Knowledge Network`);
    console.log('\n   The AI Knowledge Universe expands with philosophical wisdom! 🌟\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
