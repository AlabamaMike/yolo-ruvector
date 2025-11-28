#!/usr/bin/env node

/**
 * Build Science Knowledge Graph v2
 * Creates a comprehensive science knowledge network using ruvector's native graph API
 */

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'science_graph.db');

async function buildGraph() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('       BUILDING SCIENCE KNOWLEDGE GRAPH NETWORK');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const db = new GraphDatabase({ storagePath: dbPath });

    console.log('📊 Creating Science Concept Nodes...\n');

    // Create Science Concepts
    const concepts = [
      { name: "Quantum Mechanics", field: "physics", importance: "10" },
      { name: "Thermodynamics", field: "physics", importance: "9" },
      { name: "Evolution", field: "biology", importance: "10" },
      { name: "Molecular Biology", field: "biology", importance: "9" },
      { name: "Organic Chemistry", field: "chemistry", importance: "9" },
      { name: "Biochemistry", field: "chemistry", importance: "9" },
      { name: "Genetics", field: "biology", importance: "10" },
      { name: "Electromagnetism", field: "physics", importance: "9" }
    ];

    for (const props of concepts) {
      const query = `CREATE (c:Concept {name: '${props.name}', field: '${props.field}', importance: '${props.importance}'}) RETURN c`;
      await db.query(query);
      console.log(`  ✓ Created Concept: ${props.name} (${props.field}, importance: ${props.importance})`);
    }

    console.log('\n👨‍🔬 Creating Scientist Nodes...\n');

    // Create Scientists
    const scientists = [
      { name: "Einstein", era: "20th century", contributions: "relativity" },
      { name: "Darwin", era: "19th century", contributions: "evolution" },
      { name: "Curie", era: "20th century", contributions: "radioactivity" },
      { name: "Feynman", era: "20th century", contributions: "quantum electrodynamics" },
      { name: "Crick", era: "20th century", contributions: "DNA structure" }
    ];

    for (const props of scientists) {
      const query = `CREATE (s:Scientist {name: '${props.name}', era: '${props.era}', contributions: '${props.contributions}'}) RETURN s`;
      await db.query(query);
      console.log(`  ✓ Created Scientist: ${props.name} (${props.era}) - ${props.contributions}`);
    }

    console.log('\n🔗 Creating Relationships...\n');

    // Create Scientist → Concept relationships
    const scientistRelations = [
      { from: "Einstein", rel: "PIONEERED", to: "Quantum Mechanics" },
      { from: "Darwin", rel: "PIONEERED", to: "Evolution" },
      { from: "Curie", rel: "CONTRIBUTED_TO", to: "Organic Chemistry" },
      { from: "Feynman", rel: "PIONEERED", to: "Quantum Mechanics" },
      { from: "Crick", rel: "PIONEERED", to: "Molecular Biology" }
    ];

    for (const rel of scientistRelations) {
      const query = `MATCH (s:Scientist {name: '${rel.from}'}), (c:Concept {name: '${rel.to}'}) CREATE (s)-[:${rel.rel}]->(c)`;
      await db.query(query);
      console.log(`  ✓ ${rel.from} --[${rel.rel}]--> ${rel.to}`);
    }

    // Create Concept → Concept relationships
    const conceptRelations = [
      { from: "Quantum Mechanics", rel: "INFLUENCES", to: "Molecular Biology" },
      { from: "Evolution", rel: "CONNECTS_TO", to: "Genetics" },
      { from: "Molecular Biology", rel: "CONNECTS_TO", to: "Biochemistry" },
      { from: "Organic Chemistry", rel: "ENABLES", to: "Biochemistry" },
      { from: "Thermodynamics", rel: "UNDERLIES", to: "Biochemistry" }
    ];

    for (const rel of conceptRelations) {
      const query = `MATCH (c1:Concept {name: '${rel.from}'}), (c2:Concept {name: '${rel.to}'}) CREATE (c1)-[:${rel.rel}]->(c2)`;
      await db.query(query);
      console.log(`  ✓ ${rel.from} --[${rel.rel}]--> ${rel.to}`);
    }

    console.log('\n\n📈 Querying Graph Structure...\n');

    // Query all concepts
    const conceptsResult = await db.query('MATCH (c:Concept) RETURN c');
    console.log(`✓ Total Concepts: ${conceptsResult.nodes.length}`);

    // Query all scientists
    const scientistsResult = await db.query('MATCH (s:Scientist) RETURN s');
    console.log(`✓ Total Scientists: ${scientistsResult.nodes.length}`);

    // Query all relationships
    const relationsResult = await db.query('MATCH (n)-[r]->(m) RETURN r');
    console.log(`✓ Total Relationships: ${relationsResult.edges.length}`);

    // Get graph stats
    const stats = await db.stats();
    console.log(`\n📊 Graph Statistics:`);
    console.log(`   - Total Nodes: ${stats.totalNodes}`);
    console.log(`   - Total Edges: ${stats.totalEdges}`);
    console.log(`   - Average Degree: ${stats.avgDegree.toFixed(2)}`);

    console.log('\n\n🎯 Graph Successfully Created!');
    console.log(`   Database: ${dbPath}`);
    console.log('\n═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error building graph:', error.message);
    console.error('Stack:', error.stack);
  }
}

buildGraph();
