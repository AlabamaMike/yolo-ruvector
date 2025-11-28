#!/usr/bin/env node

const { VectorDb } = require('@ruvector/core');

const DB_PATH = '/home/user/yolo-ruvector/data/science.ruv';

async function verify() {
  try {
    console.log('Verifying science database...\n');

    const db = new VectorDb({
      dimensions: 384,
      distanceMetric: 'Cosine',
      storagePath: DB_PATH
    });

    const count = await db.len();
    const isEmpty = await db.isEmpty();

    console.log(`Database path: ${DB_PATH}`);
    console.log(`Vector count: ${count}`);
    console.log(`Is empty: ${isEmpty}`);
    console.log(`Dimension: 384`);
    console.log(`Metric: Cosine`);

    console.log('\n✅ Database verification complete!');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

verify();
