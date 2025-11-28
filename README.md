# AI Knowledge Universe

A unified AI knowledge management system built on **ruvector** - a high-performance Rust-based vector database with graph capabilities. This system integrates semantic search across three distinct knowledge domains: Science, Technology, and Philosophy.

## Features

- **Multi-Domain Vector Search** - Separate vector databases for Science, Technology, and Philosophy with 384-dimensional embeddings
- **Semantic Query Routing** - Intelligent classification of queries to appropriate knowledge domains
- **Knowledge Graph Networks** - Property graphs with Neo4j-compatible Cypher queries linking concepts, scientists, and philosophers
- **Differentiable Neural Search** - GNN-based search with soft attention mechanisms and learnable weights
- **Distributed Architecture** - Raft-based consensus protocol with consistent hashing and 2x replication
- **Interactive Dashboard** - Modern web UI for searching and visualizing the knowledge graph

## Quick Start

### Installation

```bash
npm install
```

### Run the CLI

```bash
# Start interactive CLI
npm start

# Search a specific query
npm run search "How do neural networks relate to brain function?"

# Run the demo
npm run demo
```

### CLI Commands

```bash
# Smart routing to best domain
node src/cli.ts search "<query>"

# Search all domains simultaneously
node src/cli.ts multi "<query>"

# Find concept connections via graph
node src/cli.ts connect "<concept_a> -> <concept_b>"
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Knowledge Universe Orchestrator               │
├─────────────────────────────────────────────────────────────────┤
│                      Semantic Router Layer                       │
│    ┌──────────────┬──────────────────┬──────────────────┐       │
│    │   Science    │    Technology    │    Philosophy    │       │
│    │   Intents    │     Intents      │     Intents      │       │
│    └──────────────┴──────────────────┴──────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                     Vector Database Layer                        │
│    ┌──────────────┬──────────────────┬──────────────────┐       │
│    │ science.ruv  │  technology.ruv  │  philosophy.ruv  │       │
│    │  (1.6 MB)    │     (1.6 MB)     │     (1.6 MB)     │       │
│    └──────────────┴──────────────────┴──────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                    Knowledge Graph Layer                         │
│    ┌──────────────┬──────────────────┬──────────────────┐       │
│    │   Science    │    Technology    │    Philosophy    │       │
│    │   Graph DB   │     Graph DB     │     Graph DB     │       │
│    └──────────────┴──────────────────┴──────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                   Distributed Cluster Layer                      │
│         (Raft Consensus | 3 Nodes | 2x Replication)              │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
ai-knowledge-universe/
├── src/
│   ├── cli.ts                    # Command-line interface
│   └── orchestrator.ts           # Query orchestration engine
├── data/
│   ├── science.ruv               # Science vector database
│   ├── technology.ruv            # Technology vector database
│   ├── philosophy.ruv            # Philosophy vector database
│   ├── *_vectors.json            # Vector definitions
│   └── *_graph.db                # Graph databases
├── routers/
│   ├── science_intents.json      # Physics, chemistry, biology routing
│   ├── tech_intents.json         # AI/ML, infrastructure, programming routing
│   └── philosophy_intents.json   # Ethics, metaphysics, epistemology routing
├── gnn/
│   ├── layer_config.json         # Neural network layer configuration
│   ├── search_config.json        # Differentiable search parameters
│   └── NEURAL_SEARCH_REPORT.md   # Implementation details
├── cluster/
│   ├── config.json               # Raft consensus configuration
│   └── topology.json             # Cluster topology
├── dashboard/
│   └── index.html                # Web dashboard UI
└── embeddings/
    └── cross_domain_concepts.txt # Cross-domain linking
```

## Knowledge Domains

### Science Domain
- **Physics**: Quantum mechanics, relativity, gravity, thermodynamics
- **Chemistry**: Molecular bonds, reactions, catalysis, organic chemistry
- **Biology**: DNA, photosynthesis, CRISPR, evolution, neuroscience
- **Graph**: 8 concepts + 5 scientists with relationship edges

### Technology Domain
- **AI/ML**: Transformers, deep learning, LLMs, backpropagation
- **Infrastructure**: Kubernetes, vector databases, containerization
- **Programming**: Rust, WebAssembly, GraphQL
- **Hardware**: GPUs, TPUs, quantum computers, neuromorphic chips
- **Graph**: 8 tech nodes + 5 organizations with 10 relationships

### Philosophy Domain
- **Ethics**: Utilitarianism, deontology, virtue ethics, moral relativism
- **Metaphysics**: Free will, consciousness, identity, causation
- **Epistemology**: Empiricism, rationalism, skepticism, knowledge justification
- **Graph**: 15 nodes (8 concepts + 7 philosophers) with 11 relationships

## Database Specifications

| Domain | File | Concepts | Dimensions | Metric |
|--------|------|----------|------------|--------|
| Science | `data/science.ruv` | 20 | 384 | Cosine |
| Technology | `data/technology.ruv` | 20 | 384 | Cosine |
| Philosophy | `data/philosophy.ruv` | 20 | 384 | Cosine |

## Building Knowledge Graphs

```bash
# Build domain-specific graphs
node build_science_graph.js
node build_technology_graph.js
node build_philosophy_graph.js

# Query graphs
node query_science_graph.js
node query_tech_graph.js

# Verify graph integrity
node verify_philosophy_graph.js
```

## Configuration

### Semantic Router Configuration

Each domain has intent patterns for query classification:

```json
{
  "domain": "science",
  "intents": [
    {
      "name": "physics_query",
      "patterns": ["gravity", "quantum", "relativity", "thermodynamics"]
    },
    {
      "name": "biology_query",
      "patterns": ["DNA", "photosynthesis", "CRISPR", "evolution"]
    }
  ]
}
```

### Cluster Configuration

```json
{
  "consensus": "raft",
  "nodes": 3,
  "replication_factor": 2,
  "virtual_nodes": 128,
  "shard_keys": ["science", "technology", "philosophy"]
}
```

## API Reference

### KnowledgeUniverseOrchestrator

```typescript
import { KnowledgeUniverseOrchestrator } from './src/orchestrator';

const orchestrator = new KnowledgeUniverseOrchestrator();

// Route query to best domain
const decision = await orchestrator.route("What is quantum entanglement?");
// Returns: { intent: 'physics_query', confidence: 0.92, targetDatabase: 'science' }

// Search with automatic routing
const results = await orchestrator.search("How do transformers work?");

// Search all domains simultaneously
const allResults = await orchestrator.multiDomainSearch("consciousness");

// Find graph connections between concepts
const paths = await orchestrator.findConnections("neural networks", "brain");
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js with TypeScript |
| Vector Database | ruvector (Rust-based HNSW indexing) |
| Graph Database | ruvector Graph-Node |
| Consensus | Raft protocol |
| Persistence | Binary format (.ruv, .db) |
| Query Language | Cypher (Neo4j-compatible) |
| Embeddings | 384-dimensional vectors |

## Dependencies

```json
{
  "@ruvector/core": "^0.1.15",
  "@ruvector/graph-node": "^0.1.15",
  "ruvector": "^0.1.24",
  "better-sqlite3": "^12.4.6"
}
```

## Development

### Prerequisites

- Node.js 14+
- npm or yarn
- Linux/macOS (for Rust native modules)

### Dev Dependencies

```bash
npm install --save-dev ts-node typescript
```

### Running Tests

```bash
# Test graph functionality
node test_graph_simple.js

# Test data persistence
node test_graph_persistence.js

# Verify database integrity
node verify_db.js
```

## Documentation

Detailed technical documentation is available in the mission reports:

- `SCIENCE_DATABASE_REPORT.md` - Science vector database implementation
- `PHILOSOPHY_DATABASE_REPORT.md` - Philosophy vector database implementation
- `AGENT5_TECH_GRAPH_REPORT.md` - Technology graph network
- `PHILOSOPHY_GRAPH_REPORT.md` - Philosophy graph network
- `SCIENCE_GRAPH_REPORT.md` - Science graph network
- `gnn/NEURAL_SEARCH_REPORT.md` - Differentiable neural search

## License

MIT
