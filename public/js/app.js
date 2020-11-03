'use strict';

function menu() {
  if (document.getElementById('nav').style['display'] === 'none') {
    document.getElementById('nav').style['display'] = 'flex';
  } else if (document.getElementById('nav').style['display'] === 'flex') {
    document.getElementById('nav').style['display'] = 'none';
  }
}

function update() {
  event.preventDefault();
  if (document.getElementById('updatearea').style['display'] === 'none') {
    document.getElementById('updatearea').style['display'] = 'flex';
  } else if (document.getElementById('updatearea').style['display'] === 'flex') {
    document.getElementById('updatearea').style['display'] = 'none';
  }
}
