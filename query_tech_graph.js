#!/usr/bin/env node

/**
 * Query Technology Graph
 * Shows the technology knowledge network created with ruvector graph
 */

const { GraphDatabase } = require('@ruvector/graph-node');
const path = require('path');

const dbPath = path.join(__dirname, 'ruvector.db');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('           TECHNOLOGY KNOWLEDGE GRAPH REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

try {
  // Open the graph database
  const db = GraphDatabase.open(dbPath);

  console.log(`📍 Database Path: ${db.getStoragePath()}`);
  console.log(`💾 Persistent: ${db.isPersistent()}\n`);

  // Query all nodes
  console.log('🏷️  ALL NODES:');
  console.log('─'.repeat(60));
  const allNodesResult = db.querySync('MATCH (n) RETURN n');

  // Group nodes by label
  const nodesByLabel = {};
  allNodesResult.nodes.forEach(node => {
    node.labels.forEach(label => {
      if (!nodesByLabel[label]) {
        nodesByLabel[label] = [];
      }
      nodesByLabel[label].push(node);
    });
  });

  Object.keys(nodesByLabel).sort().forEach(label => {
    console.log(`\n  ${label} (${nodesByLabel[label].length} nodes):`);
    nodesByLabel[label].forEach(node => {
      const name = node.properties.name || 'Unknown';
      const otherProps = Object.entries(node.properties)
        .filter(([k]) => k !== 'name')
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      console.log(`    • ${name}${otherProps ? ` (${otherProps})` : ''}`);
    });
  });

  // Query all relationships
  console.log('\n\n🔗 ALL RELATIONSHIPS:');
  console.log('─'.repeat(60));
  const relationshipsResult = db.querySync('MATCH (n)-[r]->(m) RETURN n, r, m');

  console.log(`  Total: ${relationshipsResult.edges.length} relationships\n`);

  // Group relationships by type
  const relsByType = {};
  relationshipsResult.edges.forEach(edge => {
    if (!relsByType[edge.edgeType]) {
      relsByType[edge.edgeType] = [];
    }
    relsByType[edge.edgeType].push(edge);
  });

  Object.keys(relsByType).sort().forEach(type => {
    console.log(`\n  ${type} (${relsByType[type].length}):`);
    relsByType[type].forEach(edge => {
      const fromNode = relationshipsResult.nodes.find(n => n.id === edge.from);
      const toNode = relationshipsResult.nodes.find(n => n.id === edge.to);
      const fromName = fromNode?.properties.name || edge.from;
      const toName = toNode?.properties.name || edge.to;
      const fromLabel = fromNode?.labels[0] || 'Node';
      const toLabel = toNode?.labels[0] || 'Node';

      console.log(`    ${fromLabel}:"${fromName}" --[${type}]--> ${toLabel}:"${toName}"`);
    });
  });

  // Technology-to-Technology relationships
  console.log('\n\n🔬 TECHNOLOGY → TECHNOLOGY:');
  console.log('─'.repeat(60));
  const techToTech = db.querySync('MATCH (t:Technology)-[r]->(t2:Technology) RETURN t, r, t2');
  techToTech.edges.forEach(edge => {
    const fromNode = techToTech.nodes.find(n => n.id === edge.from);
    const toNode = techToTech.nodes.find(n => n.id === edge.to);
    const fromName = fromNode?.properties.name || edge.from;
    const toName = toNode?.properties.name || edge.to;
    console.log(`  "${fromName}" --[${edge.edgeType}]--> "${toName}"`);
  });

  // Organization-to-Technology relationships
  console.log('\n\n🏢 ORGANIZATION → TECHNOLOGY:');
  console.log('─'.repeat(60));
  const orgToTech = db.querySync('MATCH (o:Organization)-[r]->(t:Technology) RETURN o, r, t');
  orgToTech.edges.forEach(edge => {
    const fromNode = orgToTech.nodes.find(n => n.id === edge.from);
    const toNode = orgToTech.nodes.find(n => n.id === edge.to);
    const fromName = fromNode?.properties.name || edge.from;
    const toName = toNode?.properties.name || edge.to;
    console.log(`  "${fromName}" --[${edge.edgeType}]--> "${toName}"`);
  });

  // Summary statistics
  console.log('\n\n📊 GRAPH STATISTICS:');
  console.log('─'.repeat(60));
  console.log(`  Total Nodes: ${allNodesResult.nodes.length}`);
  console.log(`  Total Edges: ${relationshipsResult.edges.length}`);
  console.log(`  Node Types: ${Object.keys(nodesByLabel).join(', ')}`);
  console.log(`  Relationship Types: ${Object.keys(relsByType).join(', ')}`);
  if (allNodesResult.nodes.length > 1) {
    const density = relationshipsResult.edges.length / (allNodesResult.nodes.length * (allNodesResult.nodes.length - 1));
    console.log(`  Graph Density: ${density.toFixed(4)}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n');

} catch (error) {
  console.error('❌ Error querying graph:', error.message);
  console.error(error);
}
