class Queue {
    constructor() {
        this.content = [];
    }

    enqueue(item) {
        this.content.push(item);
    }

    dequeue() {
        return this.content.shift();
    }

    isEmpty() {
        return this.content.length === 0;
    }
}

class Node {
    constructor(nodeId) {
        this.id = nodeId;
        this.adjacencies = []; // childs
        this.marked = false;
        this.color = null;
        this.level = 0;
    }

    setColor(newColor) {
        this.color = newColor;
        let data = Graph.graphData();
        data.nodes[this.id].color = this.color;
        Graph.graphData(data);
    }

    addAdjacency(adjNode) {
        this.adjacencies.push(adjNode);
    }

    mark() {
        this.marked = true;
    }

    unmark() {
        this.marked = false;
    }
}

const buildRandomGraph = (nodeCount) => {
    let nodes = [];
    let randomIndex = 0;
    for (let i = 0; i < nodeCount; i++) {
        const node = new Node(i);
        nodes.push(node);
    }
    for (let i = 0; i < nodeCount; i++) {
        randomIndex = Math.round(Math.random() * (nodeCount / 4));
        nodes[i].addAdjacency(nodes[randomIndex]);
        nodes[randomIndex].addAdjacency(nodes[i]);
    }
    return nodes;
}

function nodesToGraph(nodes) {
    let graphData = {
        nodes: [],
        links: [],
    }

    let adjacencies = {};
    for (let i = 0; i < nodes.length; i++) {
        graphData.nodes.push({id: nodes[i].id, color: "#ffffff"});

        for (let j = 0; j < nodes[i].adjacencies.length; j++) {
            if (!(`${nodes[i].adjacencies[j].id}_${nodes[i].id}` in adjacencies)) {
                adjacencies[`${nodes[i].id}_${nodes[i].adjacencies[j].id}`] = {source: nodes[i].id, target: nodes[i].adjacencies[j].id};
            }
        }
    }

    graphData.links = Object.values(adjacencies);
    return graphData;
}

async function breadthSearcher() {
    while (!queue.isEmpty()) {
        await breadthSearchD();
    }
}

function waitForIt() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 2000);
    })
}

function breadthSearchD() {
    return new Promise(resolve => {
        setTimeout(() => {
            let node = queue.dequeue();
            node.mark();
            node.level++;

            node.setColor(`#${(node.level * 4).toString(16)}0000`);

            for (let i = 0; i < node.adjacencies.length; i++) {
                if (!node.adjacencies[i].marked) {
                    node.adjacencies[i].mark();
                    node.adjacencies[i].level = node.level;
                    queue.enqueue(node.adjacencies[i]);
                }
            }
            resolve();

        }, 10);
    });
}

function depthSearcher(node) {
    node.mark();

    for (let i = 0; i < node.adjacencies.length; i++) {
        if (!node.marked) {
            node.adjacencies[i].mark();
            depthSearcher(node.adjacencies[i]);
        }
    }
}

nodes = buildRandomGraph(1000);
gD = nodesToGraph(nodes);
const queue = new Queue();

const startBS = (node) => {
    console.log(node);
    queue.enqueue(nodes[node.id]);

    breadthSearcher().then(r => {});
}

const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
    .enableNodeDrag(false)
    .onNodeClick(startBS);

Graph.graphData(gD);

/*
let angle = 0;
setInterval(() => {
    Graph.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
    });
    angle += Math.PI / 300;
}, 100);*/
