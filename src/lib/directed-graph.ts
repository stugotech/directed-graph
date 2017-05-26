
/**
 * Represents a graph with vertices and edges.
 */
export class DirectedGraph<T> {
  private _edges: Map<T, T[]>;


  /**
   * Create a new instance.
   */
  constructor() {
    this._edges = new Map<T, T[]>();
  }


  /**
   * Add a directed edge.  This will add any vertex not already known.
   * @param source The source of the edge.
   * @param target The target of the edge.
   */
  addEdge(source: T, target: T) {
    const targets = this.addVertex(source);
    this.addVertex(target);
    targets.push(target);
  }


  /**
   * Add a vertex.
   * @param vertex The vertex to add.
   */
  addVertex(vertex: T) {
    let targets = this._edges.get(vertex);

    if (targets === undefined) {
      targets = [];
      this._edges.set(vertex, targets);
    }

    return targets;
  }


  /**
   * Get the edges.
   */
  edges(): Map<T, T[]> {
    return this._edges;
  }


  /**
   * Get the leaf nodes.
   */
  leaves(): T[] {
    return [...this._edges.entries()].filter(x => x[1].length === 0).map(x => x[0]);
  }


  /**
   * Return a graph which is the reverse of this graph.
   */
  reverse(): DirectedGraph<T> {
    const rev = new DirectedGraph<T>();

    for (let [source, targets] of this._edges.entries()) {
      // add vertex explicitly in case there are no targets
      rev.addVertex(source);

      for (let target of targets) {
        rev.addEdge(target, source);
      }
    }

    return rev;
  }


  /**
   * Gets the path length of each reachable node to the given vertex.
   * @param root The root vertex.
   */
  getAdjacencyToNode(root: T): Map<T, number> {
    const adjacencies = new Map<T, number>();
    const parents: T[] = [];
    const stack: T[] = [];

    stack.push(root);

    while (stack.length > 0) {
      const curr = stack[stack.length - 1] as T; // length > 0 so not undefined
      const children = this._edges.get(curr);

      if (children === undefined) {
        throw new Error('unknown vertex');
      }

      if (parents.length > 0 && curr === parents[parents.length-1]) {
        parents.pop();
        stack.pop();
        continue;
      } 

      // set the adjacency of the current node if on a new/longer path.
      const adj = adjacencies.get(curr);

      if (adj === undefined || adj < parents.length) {
        adjacencies.set(curr, parents.length);
      } else {
        // abort this path if already seen
        parents.pop();
        stack.pop();
        continue;
      }

      parents.push(curr);

      for (let child of children) {
        // loop detection
        let i = parents.indexOf(child);

        if (i > -1) {
          // found circular reference
          let path = '';
          // build path for error
          for (; i < parents.length; ++i) {
            path += parents[i].toString();
            path += ' -> ';
          }
          throw new Error('found circular reference ' + path + child.toString());
        }

        stack.push(child);
      }
    } // while (stack.length > 0)

    return adjacencies;
  }
}
