const getSvg = new XMLHttpRequest();

getSvg.onload = function onload() {
  const parametricSvg = document.createElement('parametric-svg');
  parametricSvg.innerHTML = this.responseText;
  document.body.appendChild(parametricSvg);
};

getSvg.open('get', 'beam.parametric.svg', true);
getSvg.send();
