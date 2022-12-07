const NodeNumber = 20;
const gData = {
    nodes: [...Array(NodeNumber).keys()].map(i => ({id: i})),
    links: [...Array(NodeNumber).keys()]
        .filter(id => id)
        .map(id => ({
            source: id,
            target: Math.round(Math.random() * (id - 1))
        }))
};

const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
    .graphData(gData);
