#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the core module directly
const core = require('@ruvector/core');
const VectorDb = core.VectorDb;
const JsDistanceMetric = core.JsDistanceMetric;

console.log('Creating technology vector database...\n');

// Create database path
const dbPath = '/home/user/yolo-ruvector/data/technology.ruv';

// Database configuration
const config = {
  dimensions: 384,
  distanceMetric: JsDistanceMetric.Cosine,
  storagePath: dbPath
};

// Create the vector database
const db = new VectorDb(config);

// Tech vectors data
const techVectors = {
  "vectors": [
    {"id": "ai_001", "text": "Transformer architecture uses self-attention mechanisms for sequence processing", "category": "ai"},
    {"id": "ai_002", "text": "Reinforcement learning trains agents through reward signals and environment interaction", "category": "ai"},
    {"id": "ai_003", "text": "Large language models predict next tokens using billions of learned parameters", "category": "ai"},
    {"id": "sw_001", "text": "Microservices architecture decomposes applications into small independent services", "category": "software"},
    {"id": "sw_002", "text": "Container orchestration manages deployment and scaling of containerized applications", "category": "software"},
    {"id": "sw_003", "text": "Event-driven architecture uses events to trigger and communicate between services", "category": "software"},
    {"id": "hw_001", "text": "GPUs accelerate parallel computing with thousands of cores for matrix operations", "category": "hardware"},
    {"id": "hw_002", "text": "Quantum computers use qubits that can exist in superposition states", "category": "hardware"},
    {"id": "hw_003", "text": "Neuromorphic chips mimic brain structure for energy-efficient AI computation", "category": "hardware"},
    {"id": "ai_004", "text": "Diffusion models generate data by learning to reverse a noise addition process", "category": "ai"},
    {"id": "ai_005", "text": "Vector databases enable semantic search using high-dimensional embeddings", "category": "ai"},
    {"id": "sw_004", "text": "GraphQL provides a query language for APIs with typed schemas", "category": "software"},
    {"id": "sw_005", "text": "WebAssembly enables near-native performance for web applications", "category": "software"},
    {"id": "hw_004", "text": "TPUs are application-specific integrated circuits optimized for tensor operations", "category": "hardware"},
    {"id": "ai_006", "text": "Federated learning trains models across decentralized devices without sharing data", "category": "ai"},
    {"id": "sw_006", "text": "Serverless computing automatically manages infrastructure and scaling", "category": "software"},
    {"id": "hw_005", "text": "NVMe storage provides low-latency access through PCIe interface", "category": "hardware"},
    {"id": "ai_007", "text": "Mixture of experts routes inputs to specialized sub-networks", "category": "ai"},
    {"id": "sw_007", "text": "CQRS separates read and write operations for complex domains", "category": "software"},
    {"id": "hw_006", "text": "In-memory computing processes data directly where it is stored", "category": "hardware"}
  ]
};

// Save the JSON file
const jsonPath = '/home/user/yolo-ruvector/data/tech_vectors.json';
fs.writeFileSync(jsonPath, JSON.stringify(techVectors, null, 2));
console.log(`✓ Created ${jsonPath}`);

// Function to generate a simple embedding from text (mock for demo)
function generateEmbedding(text, dimension) {
  // Simple hash-based embedding generation for demo
  const embedding = new Float32Array(dimension);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const idx = (charCode * i) % dimension;
    embedding[idx] += charCode / 1000;
  }

  // Normalize
  let magnitude = 0;
  for (let i = 0; i < embedding.length; i++) {
    magnitude += embedding[i] * embedding[i];
  }
  magnitude = Math.sqrt(magnitude);

  for (let i = 0; i < embedding.length; i++) {
    embedding[i] /= magnitude;
  }

  return embedding;
}

async function main() {
  console.log(`\nInserting ${techVectors.vectors.length} vectors...`);

  // Insert vectors
  for (let index = 0; index < techVectors.vectors.length; index++) {
    const item = techVectors.vectors[index];
    const vector = generateEmbedding(item.text, config.dimensions);

    await db.insert({
      id: item.id,
      vector: vector
    });

    if ((index + 1) % 5 === 0) {
      console.log(`  Inserted ${index + 1}/${techVectors.vectors.length} vectors`);
    }
  }

  console.log(`✓ Inserted all ${techVectors.vectors.length} vectors\n`);

  // Get statistics
  const count = await db.len();
  console.log('─'.repeat(80));
  console.log('Database Statistics:');
  console.log(`  Total vectors: ${count}`);
  console.log(`  Dimension: ${config.dimensions}`);
  console.log(`  Metric: Cosine`);
  console.log(`  Implementation: Native (Rust)`);
  console.log(`  Storage: ${dbPath}`);

  // Perform a search
  console.log('\nTesting search: "How do neural networks learn?"\n');
  const queryVector = generateEmbedding("How do neural networks learn?", config.dimensions);
  const searchResults = await db.search({
    vector: queryVector,
    k: 5
  });

  console.log('Top 5 Results:');
  console.log('─'.repeat(80));
  for (let index = 0; index < searchResults.length; index++) {
    const result = searchResults[index];
    // Find the original item to get metadata
    const originalItem = techVectors.vectors.find(v => v.id === result.id);

    console.log(`${index + 1}. Score: ${result.score.toFixed(4)}`);
    console.log(`   ID: ${result.id}`);
    if (originalItem) {
      console.log(`   Category: ${originalItem.category}`);
      console.log(`   Text: ${originalItem.text}`);
    }
    console.log('');
  }

  console.log('\n✓ Technology domain vector database created successfully!');
}

main().catch(console.error);
