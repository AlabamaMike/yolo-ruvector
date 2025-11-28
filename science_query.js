#!/usr/bin/env node

const fs = require('fs');
const { VectorDb } = require('@ruvector/core');

const DB_PATH = '/home/user/yolo-ruvector/data/science.ruv';
const VECTORS_PATH = '/home/user/yolo-ruvector/data/science_vectors.json';

// Load metadata for results
const data = JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf8'));

function generateSimpleEmbedding(text, dimension) {
  const vector = new Float32Array(dimension);
  const words = text.toLowerCase().split(/\s+/);

  for (let i = 0; i < dimension; i++) {
    let value = 0;
    for (let j = 0; j < words.length; j++) {
      const word = words[j];
      const charCode = word.charCodeAt(i % word.length) || 0;
      value += Math.sin(charCode * (i + 1) + j) * 0.1;
    }
    vector[i] = value / Math.sqrt(words.length);
  }

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  for (let i = 0; i < dimension; i++) {
    vector[i] /= magnitude || 1;
  }

  return vector;
}

async function runQuery(queryText) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`QUERY: "${queryText}"`);
  console.log('='.repeat(70));

  const db = new VectorDb({
    dimensions: 384,
    distanceMetric: 'Cosine',
    storagePath: DB_PATH
  });

  const queryVector = generateSimpleEmbedding(queryText, 384);
  const results = await db.search({ vector: queryVector, k: 3 });

  console.log('\nTop 3 Results:\n');
  results.forEach((result, idx) => {
    const item = data.vectors.find(v => v.id === result.id);
    console.log(`${idx + 1}. [${result.id}] - Score: ${result.score.toFixed(4)}`);
    if (item) {
      console.log(`   Category: ${item.category.toUpperCase()}`);
      console.log(`   ${item.text}`);
    }
    console.log('');
  });
}

async function main() {
  console.log('\n🔬 SCIENCE DOMAIN VECTOR DATABASE - Query Demo\n');

  const queries = [
    "How do atoms bond together?",
    "What causes black holes in space?",
    "How do cells generate energy?"
  ];

  for (const query of queries) {
    await runQuery(query);
  }

  console.log('='.repeat(70));
  console.log('✅ Query demonstration complete!\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
