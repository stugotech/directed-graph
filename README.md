# directed-graph

Represents a directed graph.

## Get it

Download from NPM (typescript types are included):

    npm install --save @stugotech/directed-graph

## Use it 

### Class `DirectedGraph<T>`

A directed graph with vertices of type `T`.

#### Method `addVertex(vertex: T)`

Add a vertex to the graph.

#### Method `addEdge(source: T, target: T)`

Add an edge between `source` and `target`.  This will add any vertices it not already known.

#### Method `edges(): Map<T, T[]>`

Get a map of the edges (source to target).

#### Method `leaves(): T[]`

Get all vertices with no outgoing edges.

#### Method `reverse(): DirectedGraph<T>`

Return a graph which has the same vertices with all edges reversed.

#### Method `getAdjacencyToNode(root: T): Map<T, number>`

Generate a map containing all vertices reachable from `root` as the keys, and the path lengths to the respective vertices from the root as the values.


## Build it

This package uses [gulp](http://gulphjs.com/).  To build, run:

    gulp

This will run `clean` and `tsc` tasks.


## Licence

See [LICENCE.md](licence.md).