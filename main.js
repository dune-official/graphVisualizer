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

class Stack {
    constructor() {
        this.content = [];
    }

    push(item) {
        this.content.push(item);
    }

    pop() {
        return this.content.pop();
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
        this.level = 0;
    }

    addAdjacency(adjNode) {
        this.adjacencies.push(adjNode);
    }

    mark() {
        this.marked = true;
        visited.add(this.id);
        Graph.nodeColor(Graph.nodeColor());
    }

    unmark() {
        this.marked = false;
    }
}

const buildRandomGraph = (nodeCount) => {
    let nodes = [];
    let randomIndex = 0;

    let branchingIndex = Math.round(Math.random())+1;
    for (let i = 0; i < nodeCount; i++) {
        const node = new Node(i);
        nodes.push(node);
    }
    for (let i = 0; i < nodeCount; i++) {
        randomIndex = Math.round(Math.random() * (i - 1) / branchingIndex);
        nodes[i].addAdjacency(nodes[randomIndex]);
        nodes[randomIndex].addAdjacency(nodes[i]);
    }
    return nodes;
}

const getColor = (level) => {
    return (255-(level * 2)) > 0 ? (255-(level * 30)).toString(16) : "00";
}

const nodesToGraph = (nodes) => {
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

const clearAll = () => {
    for (let i = 0; i < nodeData.length; i++) {
        nodeData[i].unmark();
        visited.clear();
        Graph.nodeColor(Graph.nodeColor());
    }

    queue.content = [];
    stack.content = [];
}

async function breadthSearcher() {
    while (!queue.isEmpty()) {
        await breadthSearchD();
    }
}

function breadthSearchD() {
    return new Promise(resolve => {
        setTimeout(() => {
            let node = queue.dequeue();
            node.mark();
            node.level++;
            for (let i = 0; i < node.adjacencies.length; i++) {
                if (!node.adjacencies[i].marked) {
                    // await breadthSearchDChildren(node.adjacencies[i], node.level);
                    node.adjacencies[i].mark();
                    node.adjacencies[i].level = node.level;
                    queue.enqueue(node.adjacencies[i]);
                }
            }
            resolve();
        }, timeoutTime);
    });
}

async function depthSearcher() {
    while (!stack.isEmpty()) {
        await depthSearchD();
    }

}

function depthSearchD() {
    return new Promise(resolve => {
        setTimeout(() => {
            let node = stack.pop();
            node.mark();
            node.level++;
            for (let i = 0; i < node.adjacencies.length; i++) {
                if (!node.adjacencies[i].marked) {
                    // await depthSearchDChildren(node.adjacencies[i], node.level);
                    node.adjacencies[i].mark();
                    node.adjacencies[i].level = node.level;
                    stack.push(node.adjacencies[i]);
                }
            }
            resolve();
        }, timeoutTime);
    })
}

nodeData = buildRandomGraph(1000);
gD = nodesToGraph(nodeData);

let mode = "DSF";

const clear = document.getElementById("clear");
const dsfButton = document.getElementById("dsf")
const bsfButton = document.getElementById("bsf");
const modeText = document.getElementById("mode");

const timeoutTime = 100;
const visited = new Set();
const queue = new Queue();
const stack = new Stack();

dsfButton.addEventListener("click", () => {
    mode = "DSF";
    modeText.innerText = "DSF-Mode";
});

bsfButton.addEventListener("click", () => {
    mode = "BSF";
    modeText.innerText = "BSF-Mode";
});

clear.addEventListener("click", () => {
    clearAll();
});

const doSearch = (node) => {
    if (mode === "DSF") {
        console.log("depth");
        startDS(node);
    } else {
        console.log("breadth");
        startBS(node);
    }
}

const startBS = (node) => {
    queue.enqueue(nodeData[node.id]);
    breadthSearcher().then(r => {});
}

const startDS = (node) => {
    stack.push(nodeData[node.id]);
    depthSearcher().then(r => {});
}

const Graph = ForceGraph3D({ controlType: 'orbit' })(document.getElementById("3d-graph"))
    .enableNodeDrag(false)
    .nodeColor(node => {
        if (visited.has(node.id)) {
            return "#ff0000";
        } else {
            return "#ffffff";
        }
    })
    .onNodeClick(doSearch);

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
