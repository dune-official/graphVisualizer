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

        /* simply updates the graph nodes, don't ask why it is like this */
        Graph.nodeColor(Graph.nodeColor());
    }

    unmark() {
        this.marked = false;
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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

let maxID = 1;

/*const buildPyramid = (layers, layer, parentNode, nodes) => {
    if (!layer) {
        return nodes;
    }
    for (let i = 0; i < (layers - layer + 4) / 2; i++) {
        let newNode = new Node(maxID + 1);
        maxID++;

        newNode.addAdjacency(parentNode);
        parentNode.addAdjacency(newNode);
        nodes.push(newNode);
        buildPyramid(layers, layer - 1, newNode, nodes);
    }

    return nodes;
}*/

const buildPyramid = (layer, parentNode, nodes) => {
    if (!layer) {
        return nodes;
    }
    let offset = 5 * 2**(layer);

    let x = 0;
    let y = 0;

    for (let i = 0; i < 4; i++) {
        x = i % 2 === 0 ? parentNode.x + offset : parentNode.x - offset;
        y = i < 2 ? parentNode.y + offset : parentNode.y - offset;

        let newNode = new Node(maxID++);
        newNode.setPosition(x, y, parentNode.z - 50);

        newNode.addAdjacency(parentNode);
        parentNode.addAdjacency(newNode);
        nodes.push(newNode);

        buildPyramid(layer - 1, newNode, nodes);
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
        graphData.nodes.push({id: nodes[i].id, color: "#ffffff", fx: nodes[i].x, fy: nodes[i].y, fz: nodes[i].z});

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
    let node = null;
    while (!queue.isEmpty()) {
        node = await breadthSearchD();
        for (let i = 0; i < node.adjacencies.length; i++) {
            await breadthSearchDChildren(node.adjacencies[i], node.level);
        }
    }
}

function breadthSearchD() {
    return new Promise(resolve => {
        setTimeout(() => {
            let node = queue.dequeue();
            node.mark();
            node.level++;
            resolve(node);
        }, timeoutTime);
    });
}

function breadthSearchDChildren(adjacentNode, level) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!adjacentNode.marked) {
                adjacentNode.mark();
                adjacentNode.level = level;
                queue.enqueue(adjacentNode);
            }
            resolve();
        }, timeoutTime);
    })
}

async function depthSearcher() {
    let node = null;
    while (!stack.isEmpty()) {
        node = await depthSearchD();
        for (let i = 0; i < node.adjacencies.length; i++) {
            await depthSearchDChildren(node.adjacencies[i], node.level);
        }
    }

}

function depthSearchD() {
    return new Promise(resolve => {
        setTimeout(() => {
            let node = stack.pop();
            node.mark();
            node.level++;
            resolve(node);
        }, timeoutTime);
    })
}

function depthSearchDChildren(adjacentNode, level) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!adjacentNode.marked) {
                adjacentNode.mark();
                adjacentNode.level = level;
                stack.push(adjacentNode);
            }
            resolve();
        }, timeoutTime);
    });
}

// nodeData = buildRandomGraph(1024);
const layers = 5;
const startNode = new Node(0);
startNode.setPosition(0,0,0);
nodeData = buildPyramid(layers, startNode, [startNode]);
gD = nodesToGraph(nodeData);

let mode = "DSF";

const clear = document.getElementById("clear");
const dsfButton = document.getElementById("dsf")
const bsfButton = document.getElementById("bsf");
const modeText = document.getElementById("mode");

const timeoutTime = 10;
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
        startDS(node);
    } else {
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
    .linkColor(() => 'rgba(99, 207, 48, 1)')
    .linkOpacity(0.5)
    .linkWidth(2)
    .nodeColor(node => {
        if (visited.has(node.id)) {
            // return "#ff" + node.level.toString(16) + "0000";
            // return "#" + (0xfA0000 + 0x1000 * node.level).toString(16)
            let percentage = nodeData[node.id].level / layers;
            let color = `#${(0xFF * percentage).toString(16)}00${(0xFF * (1.0 - percentage)).toString(16)}`;
            console.log(`percentage: ${percentage}, co`);

            console.log("#" + (0xFF0000 + 0x1000 * nodeData[node.id].level).toString(16));
            return "#" + (0xFF0000 + 0x1000 * nodeData[node.id].level).toString(16);
        } else {
            return "#ffffff";
        }
    })
    .onNodeClick(doSearch);

Graph.graphData(gD);
// Graph.d3Force("charge").strength(0);
