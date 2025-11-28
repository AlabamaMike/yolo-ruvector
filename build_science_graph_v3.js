#!/usr/bin/env node

/**
 * Build Science Knowledge Graph v3
 * Using native GraphDatabase API methods instead of Cypher
 */

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'science_graph.db');

// Simple hash function to create embeddings from strings
function stringToEmbedding(str, dimensions = 384) {
  const embedding = new Float32Array(dimensions);
  for (let i = 0; i < dimensions; i++) {
    let hash = 0;
    for (let j = 0; j < str.length; j++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(j) + i;
      hash = hash & hash; // Convert to 32bit integer
    }
    embedding[i] = (Math.sin(hash) + 1) / 2; // Normalize to 0-1
  }
  return embedding;
}

async function buildGraph() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('       BUILDING SCIENCE KNOWLEDGE GRAPH NETWORK');
  console.log('           Using Native GraphDatabase API');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const db = new GraphDatabase({ storagePath: dbPath, dimensions: 384 });

    console.log('📊 Creating Science Concept Nodes...\n');

    // Create Science Concepts
    const concepts = [
      { id: "qm", name: "Quantum Mechanics", field: "physics", importance: "10" },
      { id: "thermo", name: "Thermodynamics", field: "physics", importance: "9" },
      { id: "evolution", name: "Evolution", field: "biology", importance: "10" },
      { id: "molbio", name: "Molecular Biology", field: "biology", importance: "9" },
      { id: "orgchem", name: "Organic Chemistry", field: "chemistry", importance: "9" },
      { id: "biochem", name: "Biochemistry", field: "chemistry", importance: "9" },
      { id: "genetics", name: "Genetics", field: "biology", importance: "10" },
      { id: "em", name: "Electromagnetism", field: "physics", importance: "9" }
    ];

    const nodeIds = {};
    for (const concept of concepts) {
      const embedding = stringToEmbedding(concept.name);
      const nodeId = await db.createNode({
        id: concept.id,
        embedding: embedding,
        labels: ["Concept"],
        properties: {
          name: concept.name,
          field: concept.field,
          importance: concept.importance
        }
      });
      nodeIds[concept.id] = nodeId;
      console.log(`  ✓ Created Concept: ${concept.name} (${concept.field}, importance: ${concept.importance})`);
    }

    console.log('\n👨‍🔬 Creating Scientist Nodes...\n');

    // Create Scientists
    const scientists = [
      { id: "einstein", name: "Einstein", era: "20th century", contributions: "relativity" },
      { id: "darwin", name: "Darwin", era: "19th century", contributions: "evolution" },
      { id: "curie", name: "Curie", era: "20th century", contributions: "radioactivity" },
      { id: "feynman", name: "Feynman", era: "20th century", contributions: "quantum electrodynamics" },
      { id: "crick", name: "Crick", era: "20th century", contributions: "DNA structure" }
    ];

    for (const scientist of scientists) {
      const embedding = stringToEmbedding(scientist.name);
      const nodeId = await db.createNode({
        id: scientist.id,
        embedding: embedding,
        labels: ["Scientist"],
        properties: {
          name: scientist.name,
          era: scientist.era,
          contributions: scientist.contributions
        }
      });
      nodeIds[scientist.id] = nodeId;
      console.log(`  ✓ Created Scientist: ${scientist.name} (${scientist.era}) - ${scientist.contributions}`);
    }

    console.log('\n🔗 Creating Relationships...\n');

    // Create Scientist → Concept relationships
    const scientistRelations = [
      { from: "einstein", to: "qm", rel: "PIONEERED" },
      { from: "darwin", to: "evolution", rel: "PIONEERED" },
      { from: "curie", to: "orgchem", rel: "CONTRIBUTED_TO" },
      { from: "feynman", to: "qm", rel: "PIONEERED" },
      { from: "crick", to: "molbio", rel: "PIONEERED" }
    ];

    for (const rel of scientistRelations) {
      const embedding = stringToEmbedding(rel.rel);
      await db.createEdge({
        from: rel.from,
        to: rel.to,
        description: rel.rel,
        embedding: embedding,
        confidence: 1.0
      });
      console.log(`  ✓ Scientist relationship: ${rel.from} --[${rel.rel}]--> ${rel.to}`);
    }

    // Create Concept → Concept relationships
    const conceptRelations = [
      { from: "qm", to: "molbio", rel: "INFLUENCES" },
      { from: "evolution", to: "genetics", rel: "CONNECTS_TO" },
      { from: "molbio", to: "biochem", rel: "CONNECTS_TO" },
      { from: "orgchem", to: "biochem", rel: "ENABLES" },
      { from: "thermo", to: "biochem", rel: "UNDERLIES" }
    ];

    for (const rel of conceptRelations) {
      const embedding = stringToEmbedding(rel.rel);
      await db.createEdge({
        from: rel.from,
        to: rel.to,
        description: rel.rel,
        embedding: embedding,
        confidence: 0.95
      });
      console.log(`  ✓ Concept relationship: ${rel.from} --[${rel.rel}]--> ${rel.to}`);
    }

    console.log('\n\n📈 Graph Statistics...\n');

    // Get graph stats
    const stats = await db.stats();
    console.log(`✓ Total Nodes: ${stats.totalNodes}`);
    console.log(`✓ Total Edges: ${stats.totalEdges}`);
    console.log(`✓ Average Degree: ${stats.avgDegree.toFixed(2)}`);
    console.log(`✓ Graph Density: ${(stats.totalEdges / (stats.totalNodes * (stats.totalNodes - 1))).toFixed(4)}`);

    console.log('\n\n🎯 Graph Successfully Created!');
    console.log(`   Database: ${dbPath}`);
    console.log(`   Persistence: ${db.isPersistent() ? 'Enabled' : 'Disabled'}`);
    console.log('\n═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error building graph:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

buildGraph();
