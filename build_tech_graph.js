#!/usr/bin/env node

/**
 * Build Technology Knowledge Graph
 * Creates nodes and relationships for the technology knowledge network
 */

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'ruvector.db');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('           BUILDING TECHNOLOGY KNOWLEDGE GRAPH');
console.log('═══════════════════════════════════════════════════════════════\n');

async function buildGraph() {
  try {
    // Open or create the graph database
    const db = GraphDatabase.open(dbPath);

    console.log('📦 Creating Technology Nodes...\n');

    // Create empty embedding (graph-node requires embeddings)
    const emptyEmbedding = new Float32Array(384).fill(0);

    // Create technology nodes
    const technologies = [
      { id: 'machine_learning', name: 'Machine Learning', domain: 'AI', maturity: 'mature' },
      { id: 'deep_learning', name: 'Deep Learning', domain: 'AI', maturity: 'mature' },
      { id: 'transformers', name: 'Transformers', domain: 'AI', maturity: 'cutting-edge' },
      { id: 'vector_databases', name: 'Vector Databases', domain: 'Infrastructure', maturity: 'emerging' },
      { id: 'kubernetes', name: 'Kubernetes', domain: 'DevOps', maturity: 'mature' },
      { id: 'graphql', name: 'GraphQL', domain: 'APIs', maturity: 'mature' },
      { id: 'webassembly', name: 'WebAssembly', domain: 'Web', maturity: 'emerging' },
      { id: 'rust', name: 'Rust', domain: 'Languages', maturity: 'mature' }
    ];

    for (const tech of technologies) {
      await db.createNode({
        id: tech.id,
        embedding: emptyEmbedding,
        labels: ['Technology'],
        properties: {
          name: tech.name,
          domain: tech.domain,
          maturity: tech.maturity
        }
      });
      console.log(`  ✓ Created: ${tech.name}`);
    }

    console.log('\n🏢 Creating Organization Nodes...\n');

    // Create organization nodes
    const organizations = [
      { id: 'openai', name: 'OpenAI', focus: 'AGI research' },
      { id: 'google', name: 'Google', focus: 'search and AI' },
      { id: 'anthropic', name: 'Anthropic', focus: 'AI safety' },
      { id: 'meta', name: 'Meta', focus: 'social and AI' },
      { id: 'cncf', name: 'CNCF', focus: 'cloud native' }
    ];

    for (const org of organizations) {
      await db.createNode({
        id: org.id,
        embedding: emptyEmbedding,
        labels: ['Organization'],
        properties: {
          name: org.name,
          focus: org.focus
        }
      });
      console.log(`  ✓ Created: ${org.name}`);
    }

    console.log('\n🔗 Creating Relationships...\n');

    // Create relationships
    const relationships = [
      // Technology to Technology
      { from: 'deep_learning', to: 'transformers', type: 'ENABLES' },
      { from: 'machine_learning', to: 'deep_learning', type: 'PARENT_OF' },
      { from: 'transformers', to: 'vector_databases', type: 'POWERS' },
      { from: 'rust', to: 'webassembly', type: 'IMPLEMENTS' },
      { from: 'kubernetes', to: 'vector_databases', type: 'ORCHESTRATES' },
      { from: 'graphql', to: 'vector_databases', type: 'QUERIES' },
      // Organization to Technology
      { from: 'openai', to: 'transformers', type: 'PIONEERED' },
      { from: 'google', to: 'transformers', type: 'INVENTED' },
      { from: 'anthropic', to: 'machine_learning', type: 'ADVANCES' },
      { from: 'cncf', to: 'kubernetes', type: 'MAINTAINS' }
    ];

    for (const rel of relationships) {
      await db.createEdge({
        from: rel.from,
        to: rel.to,
        description: rel.type,
        embedding: emptyEmbedding
      });
      console.log(`  ✓ ${rel.from} --[${rel.type}]--> ${rel.to}`);
    }

    console.log('\n✅ Graph construction complete!\n');

    // Query and display the graph
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('           TECHNOLOGY KNOWLEDGE GRAPH SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const allNodes = db.querySync('MATCH (n) RETURN n');
    const allEdges = db.querySync('MATCH (n)-[r]->(m) RETURN n, r, m');

    console.log(`📊 Total Nodes: ${allNodes.nodes.length}`);
    console.log(`🔗 Total Relationships: ${allEdges.edges.length}\n`);

    // Group by label
    const byLabel = {};
    allNodes.nodes.forEach(node => {
      node.labels.forEach(label => {
        if (!byLabel[label]) byLabel[label] = 0;
        byLabel[label]++;
      });
    });

    Object.keys(byLabel).forEach(label => {
      console.log(`  ${label}: ${byLabel[label]} nodes`);
    });

    // Group relationships by type
    console.log('\n🔗 Relationships by Type:');
    const byType = {};
    allEdges.edges.forEach(edge => {
      byType[edge.edgeType] = (byType[edge.edgeType] || 0) + 1;
    });

    Object.keys(byType).sort().forEach(type => {
      console.log(`  ${type}: ${byType[type]}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error building graph:', error.message);
    console.error(error);
    process.exit(1);
  }
}

buildGraph();
