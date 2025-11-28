#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load ruvector core directly
const { VectorDb, DistanceMetric } = require('@ruvector/core');

// File paths
const DB_PATH = '/home/user/yolo-ruvector/data/science.ruv';
const VECTORS_PATH = '/home/user/yolo-ruvector/data/science_vectors.json';

function main() {
  try {
    console.log('Creating SCIENCE domain vector database...\n');

    // Create database
    console.log('Step 1: Creating database with dimension=384, metric=cosine');
    const db = new VectorDb({
      dimensions: 384,
      distanceMetric: 'Cosine',
      storagePath: DB_PATH
    });
    console.log('✓ Database created successfully!\n');

    // Load vectors from JSON file
    console.log('Step 2: Loading vectors from JSON file');
    const data = JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf8'));
    console.log(`✓ Loaded ${data.vectors.length} science concepts\n`);

    // Insert vectors
    console.log('Step 3: Inserting vectors into database');
    const vectorEntries = data.vectors.map(item => ({
      id: item.id,
      vector: generateSimpleEmbedding(item.text, 384)
    }));

    for (let i = 0; i < vectorEntries.length; i++) {
      db.insert(vectorEntries[i]).then(() => {
        console.log(`✓ Inserted ${data.vectors[i].id}: ${data.vectors[i].text.substring(0, 60)}...`);
      }).catch(err => {
        console.error(`✗ Failed to insert ${data.vectors[i].id}:`, err.message);
      });
    }

    // Wait a bit for async operations
    setTimeout(() => {
      // Test search
      console.log('\nStep 4: Testing search - "How do atoms bond together?"');
      const query = "How do atoms bond together?";
      const queryVector = generateSimpleEmbedding(query, 384);

      db.search({ vector: queryVector, k: 5 }).then(results => {
        console.log('\nTop 5 Search Results:');
        console.log('====================\n');
        results.forEach((result, idx) => {
          const item = data.vectors.find(v => v.id === result.id);
          console.log(`${idx + 1}. [${result.id}] (score: ${result.score.toFixed(4)})`);
          if (item) {
            console.log(`   Category: ${item.category}`);
            console.log(`   Text: ${item.text}`);
          }
          console.log('');
        });

        // Get stats
        console.log('Step 5: Database Statistics');
        console.log('==========================');
        db.len().then(count => {
          console.log(`Total vectors: ${count}`);
          console.log(`Dimension: 384`);
          console.log(`Metric: Cosine`);
          console.log(`Database path: ${DB_PATH}`);
          console.log('\n🎉 SCIENCE domain database created and tested successfully!');
        });
      }).catch(err => {
        console.error('Search failed:', err.message);
      });
    }, 2000);

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Simple deterministic embedding generation (for demonstration)
// In production, use a real embedding model like sentence-transformers
function generateSimpleEmbedding(text, dimension) {
  const vector = new Float32Array(dimension);
  const words = text.toLowerCase().split(/\s+/);

  // Create a deterministic but somewhat meaningful vector based on text
  for (let i = 0; i < dimension; i++) {
    let value = 0;
    for (let j = 0; j < words.length; j++) {
      const word = words[j];
      const charCode = word.charCodeAt(i % word.length) || 0;
      value += Math.sin(charCode * (i + 1) + j) * 0.1;
    }
    vector[i] = value / Math.sqrt(words.length);
  }

  // Normalize the vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  for (let i = 0; i < dimension; i++) {
    vector[i] /= magnitude || 1;
  }

  return vector;
}

main();
