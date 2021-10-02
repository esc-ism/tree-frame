const NAMESPACE = 'http://www.w3.org/2000/svg';

const svg = document.createElementNS(NAMESPACE, 'svg');

svg.classList.add('svg-pin', 'svg-icon', 'indicator');
svg.setAttribute('viewBox', '0 0 512 512');

const g = document.createElementNS(NAMESPACE, 'g');
const outline = document.createElementNS(NAMESPACE, 'path');
const ballCurve = document.createElementNS(NAMESPACE, 'path');

g.setAttribute('transform', 'rotate(270) translate(-512,0)');

outline.setAttribute('d', 'M256,0c-65.87,0-119.459,53.589-119.459,119.459c0,55.491,38.033,102.265,89.401,115.627v183.295    c0,0.786,0.092,1.567,0.275,2.332l19.997,83.598c1.073,4.49,5.076,7.664,9.692,7.689c0.018,0,0.035,0,0.054,0    c4.594,0,8.602-3.126,9.719-7.587l20.081-80.221c0.198-0.796,0.3-1.612,0.3-2.433V235.086    c51.367-13.362,89.401-60.135,89.401-115.627C375.459,53.589,321.87,0,256,0z M266.02,420.524l-9.84,39.312L245.98,417.2V238.495    c3.305,0.276,6.645,0.424,10.02,0.424s6.715-0.148,10.02-0.424V420.524z M256,218.88c-54.82,0-99.42-44.6-99.42-99.42    s44.6-99.42,99.42-99.42s99.42,44.6,99.42,99.42S310.82,218.88,256,218.88z');
ballCurve.setAttribute('d', 'M256,39.577c-44.047,0-79.882,35.835-79.882,79.882c0,5.534,4.487,10.02,10.02,10.02c5.533,0,10.02-4.486,10.02-10.02    c0-32.997,26.845-59.843,59.843-59.843c5.533,0,10.02-4.486,10.02-10.02S261.533,39.577,256,39.577z');

svg.appendChild(g);
g.appendChild(outline);
g.appendChild(ballCurve);

export default function getPin(): SVGElement {
    return svg.cloneNode(true) as SVGElement;
}
