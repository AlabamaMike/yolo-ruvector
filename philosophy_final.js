#!/usr/bin/env node
/**
 * PHILOSOPHY DOMAIN VECTOR DATABASE
 * Agent 3 of 15 - AI Knowledge Universe with ruvector
 *
 * This script creates a vector database for philosophy concepts
 * covering ethics, metaphysics, and epistemology.
 */

const fs = require('fs');
const { VectorDb, JsDistanceMetric } = require('@ruvector/core');

// Simple text-to-vector embedding function
// Note: In production, use a real embedding model like sentence-transformers
function textToVector(text, dimensions = 384) {
  const vector = new Array(dimensions).fill(0);

  // Character-based hashing
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const idx = (charCode * (i + 1)) % dimensions;
    vector[idx] += Math.sin(charCode + i) * 0.1;
  }

  // Word and length features
  const words = text.split(' ');
  for (let i = 0; i < dimensions; i++) {
    vector[i] += Math.sin(words.length * i * 0.01) * 0.05;
    vector[i] += Math.cos(text.length * i * 0.001) * 0.05;
  }

  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(v => magnitude > 0 ? v / magnitude : 0);
}

async function main() {
  console.log('\n' + '═'.repeat(75));
  console.log('   🧠 PHILOSOPHY DOMAIN VECTOR DATABASE - AGENT 3 OF 15');
  console.log('   Building the AI Knowledge Universe with ruvector');
  console.log('═'.repeat(75) + '\n');

  // ===== STEP 1: CREATE DATABASE =====
  console.log('📦 STEP 1: Creating Vector Database');
  console.log('─'.repeat(75));

  const db = new VectorDb({
    dimensions: 384,
    distanceMetric: JsDistanceMetric.Cosine,
    storagePath: '/home/user/yolo-ruvector/data/philosophy.ruv'
  });

  console.log('   ✓ Database created successfully!');
  console.log('   • Dimensions: 384');
  console.log('   • Metric: Cosine Similarity');
  console.log('   • Backend: Rust-powered HNSW index\n');

  // ===== STEP 2: LOAD DATA =====
  console.log('📚 STEP 2: Loading Philosophy Concepts');
  console.log('─'.repeat(75));

  const dataPath = '/home/user/yolo-ruvector/data/philosophy_vectors.json';
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`   ✓ Loaded ${data.vectors.length} philosophy concepts from JSON`);
  console.log('   • Categories: Ethics, Metaphysics, Epistemology\n');

  // ===== STEP 3: GENERATE EMBEDDINGS AND INSERT =====
  console.log('🔢 STEP 3: Generating Embeddings & Inserting Vectors');
  console.log('─'.repeat(75));

  const categoryCounts = { ethics: 0, metaphysics: 0, epistemology: 0 };
  const vectorData = []; // Keep for display later

  for (const item of data.vectors) {
    const vector = textToVector(item.text, 384);
    await db.insert({
      id: item.id,
      vector: new Float32Array(vector)
    });
    categoryCounts[item.category]++;
    vectorData.push(item);
  }

  console.log('   ✓ All vectors inserted successfully!');
  console.log(`   • Ethics concepts: ${categoryCounts.ethics}`);
  console.log(`   • Metaphysics concepts: ${categoryCounts.metaphysics}`);
  console.log(`   • Epistemology concepts: ${categoryCounts.epistemology}\n`);

  // ===== STEP 4: TEST SEARCH =====
  console.log('🔍 STEP 4: Testing Semantic Search');
  console.log('─'.repeat(75));

  const queries = [
    "What makes an action morally right?",
    "How do we acquire knowledge?",
    "What is the nature of reality?"
  ];

  for (const query of queries) {
    console.log(`\n   Query: "${query}"`);
    const queryVector = textToVector(query, 384);
    const results = await db.search({
      vector: new Float32Array(queryVector),
      k: 5
    });

    console.log(`   Top 5 Results:\n`);
    results.forEach((result, index) => {
      const item = vectorData.find(v => v.id === result.id);
      const score = (1 - result.score).toFixed(4); // Convert distance to similarity
      console.log(`   ${index + 1}. [${result.id}] Similarity: ${score}`);
      if (item) {
        console.log(`      📂 ${item.category.toUpperCase()}`);
        console.log(`      💡 "${item.text}"`);
      }
      console.log('');
    });
  }

  // ===== STEP 5: STATISTICS =====
  console.log('\n📊 STEP 5: Database Statistics');
  console.log('─'.repeat(75));

  const totalVectors = await db.len();
  const isEmpty = await db.isEmpty();

  console.log(`   • Total Vectors: ${totalVectors}`);
  console.log(`   • Database Status: ${isEmpty ? 'Empty' : 'Active'}`);
  console.log(`   • Storage Path: /home/user/yolo-ruvector/data/philosophy.ruv`);

  try {
    const stats = fs.statSync('/home/user/yolo-ruvector/data/philosophy.ruv');
    console.log(`   • File Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.log(`   • Storage: In-memory (not persisted)`);
  }

  // ===== SUMMARY =====
  console.log('\n' + '═'.repeat(75));
  console.log('   ✅ PHILOSOPHY DOMAIN DATABASE COMPLETE!');
  console.log('═'.repeat(75) + '\n');

  console.log('📋 MISSION SUMMARY:\n');
  console.log('   Domain: Philosophy');
  console.log('   Agent: 3 of 15');
  console.log('   Total Concepts: 20');
  console.log('   Categories:');
  console.log('     • Ethics: Moral philosophy, normative theories');
  console.log('     • Metaphysics: Reality, existence, consciousness');
  console.log('     • Epistemology: Knowledge, justification, belief');
  console.log('   \n   Technology Stack:');
  console.log('     • Vector Database: @ruvector/core (Rust-powered)');
  console.log('     • Index: HNSW (Hierarchical Navigable Small World)');
  console.log('     • Similarity: Cosine distance');
  console.log('     • Dimensions: 384');
  console.log('\n   🌟 The AI Knowledge Universe grows stronger!\n');
}

main().catch(err => {
  console.error('\n❌ ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
