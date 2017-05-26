import test from 'ava';
import { DirectedGraph } from '../lib';

/**
 * These tests use the following graph (direction is down):
 * 
 *            A     B
 *          /   \   |
 *         C     D  E
 *         |     | /
 *         |     F   G
 *          \   /  /
 *            X --   
 * 
 * Not all tests have X.
 */
function createGraph(includeX: boolean = false) {
  const graph = new DirectedGraph<string>();

  graph.addEdge('A', 'C');
  graph.addEdge('A', 'D');
  graph.addEdge('B', 'E');
  graph.addEdge('D', 'F');
  graph.addEdge('E', 'F');
  graph.addVertex('G');

  if (includeX) {
    graph.addEdge('C', 'X');
    graph.addEdge('F', 'X');
    graph.addEdge('G', 'X');
  }

  return graph;
}


test('addEdge() works', it => {
  const graph = createGraph();

  const edges = graph.edges();
  it.deepEqual(hashify(edges), {
    A: ['C', 'D'],
    B: ['E'],
    C: [],
    D: ['F'],
    E: ['F'],
    F: [],
    G: [],
  });
});

test('reverse() works', it => {
  const graph = createGraph();

  const edges = graph.reverse().edges();
  it.deepEqual(hashify(edges), {
    A: [],
    B: [],
    C: ['A'],
    D: ['A'],
    E: ['B'],
    F: ['D', 'E'],
    G: [],
  });
});


test('leaves() works', it => {
  const graph = createGraph();

  const leaves = graph.leaves();
  it.deepEqual(leaves, ['C', 'F', 'G']);
});


test('getAdjacencyToNode() works', it => {
  const graph = createGraph(true).reverse();

  const adjacencies = graph.getAdjacencyToNode('X');

  it.deepEqual(hashify(adjacencies), {
    A: 3, B: 3, C: 1, D: 2, E: 2, F: 1, G: 1, X: 0,
  });
});


test('getAdjacencyToNode() detects circular reference', it => {
  const graph = createGraph(true).reverse();
  graph.addEdge('A', 'F'); // circular ref

  it.throws(() => graph.getAdjacencyToNode('X'), 
    err => err instanceof Error && err.message === 'found circular reference F -> D -> A -> F'
  );
});


function hashify<V>(map: Map<string, V|V[]>) {
  return [...map.entries()]
    .reduce((map, kv) => { 
      let v = kv[1];
      if (Array.isArray(v)) {
        v = v.sort();
      }
      map[kv[0]] = v;
      return map;
    }, {} as any);
}