// Import stylesheets
import './style.css';
import * as d3 from 'd3';
import * as graph1 from './data.json';
// import * as graph2 from './data1.json';

const graph2 = {
  nodes: [
    { id: 'Myriel', group: 1 },
    { id: 'Napoleon', group: 1, value: 2 },
    { id: 'Mlle.Baptistine', group: 1, value: 8 },
    { id: 'Mme.Magloire', group: 1, value: 10 },
    // { id: 'CountessdeLo', group: 1 },
    // { id: 'Geborand', group: 1 },
    // { id: 'Champtercier', group: 1 },
    // { id: 'Cravatte', group: 1 },
    // { id: 'Count', group: 1 },
    // { id: 'OldMan', group: 1 },
  ],
  links: [
    { source: 'Napoleon', target: 'Myriel', value: 1 },
    { source: 'Mlle.Baptistine', target: 'Myriel', value: 8 },
    { source: 'Mme.Magloire', target: 'Myriel', value: 10 },
    // { source: 'CountessdeLo', target: 'Myriel', value: 1 },
    // { source: 'Geborand', target: 'Myriel', value: 1 },
    // { source: 'Champtercier', target: 'Myriel', value: 1 },
    // { source: 'Cravatte', target: 'Myriel', value: 1 },
    // { source: 'Count', target: 'Myriel', value: 2 },
    // { source: 'OldMan', target: 'Myriel', value: 1 },
  ],
};

const graph = graph2;

const createChart = () => {
  const width = 300;
  const height = 300;
  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);
  const color = d3.scaleOrdinal(d3.schemeTableau10);
  var simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink()
        .id(function (d) {
          return d.id;
        })
        .distance((d) => {
          return 50 - (d.value || 1) * 2;
        })
    )
    .force(
      'charge',
      d3.forceManyBody().strength((d) => {
        return -30;
      })
    )
    .force('center', d3.forceCenter(width / 2, height / 2));

  var link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke-width', function (d) {
      return Math.sqrt(d.value);
    });

  var node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(graph.nodes)
    .enter()
    .append('circle')
    // .attr('r', (d) => (d.value || 1) + 5)
    .attr('r', (d) => 20)
    .attr('fill', function (d) {
      return color(d.group);
    })
    .call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );
  node.append('title').text(function (d) {
    return d.id;
  });

  simulation.nodes(graph.nodes).on('tick', ticked);

  simulation.force('link').links(graph.links);

  function ticked() {
    link
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });

    node
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  return svg;
};

const svg = createChart();
const element = document.querySelector('div#chart');
element.appendChild(svg.node());
