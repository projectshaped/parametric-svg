const getSvg = new XMLHttpRequest();

getSvg.onload = function onload() {
  const parametricSvg = document.createElement('parametric-svg');

  parametricSvg.innerHTML = this.responseText;
  const body = document.body;
  body.insertBefore(parametricSvg, body.firstChild);

  function updateFunction(range, display, parameter) {
    return function update() {
      const value = range.value;
      display.textContent = value;
      parametricSvg.setAttribute(parameter, value);
    };
  }

  ['a', 'f'].forEach(function setStuff(variable) {
    const range = document.getElementById(variable);

    const update = updateFunction(
      range,
      document.getElementById(variable + '-display'),
      variable
    );

    update();
    range.addEventListener('input', update);
  });
};

getSvg.open('get', 'beam.parametric.svg', true);
getSvg.send();
