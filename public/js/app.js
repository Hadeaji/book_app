'use strict';


function menu(){
  if(document.getElementById('nav').style['display'] === 'none'){
    document.getElementById('nav').style['display'] = 'flex';
  }else if(document.getElementById('nav').style['display'] === 'flex'){
    document.getElementById('nav').style['display'] = 'none';
  }

}
