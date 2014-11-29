function random(a, b){
  return Math.floor(Math.random() * b) + a;
}

function randomColor(){
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function randomRGBColor(){
  var color = {};
  color.r = Math.round(Math.random()*255);
  color.g = Math.round(Math.random()*255);
  color.b = Math.round(Math.random()*255);
  return color;
}

function randomId() {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return uniqid;
}

function flipCoin() {
    return (Math.floor(Math.random() * 2) == 0);
}

//Calculates the mean of the array a1 on the field idx
function arrayMean (a1, extractor) {
  'use strict';
  var result, i;

  result = 0;
  for (i = 0; i < a1.length; i += 1) {
      result += extractor(a1[i]);
  }
  result /= a1.length;
  return result;
};

function kNearest(a1, lst, k, maxDist) {
  'use strict';
  var result = [], tempDist = [], idx = 0, worstIdx = -1, dist, agent;

  while (idx < lst.length) {
      agent = lst[idx];
      if (a1 !== agent) {
          dist = a1.pos.distance(agent.pos);
          if (dist < maxDist) {
              if (result.length < k) {
                  result.push(agent);
                  tempDist.push(dist);
                  worstIdx = tempDist.indexOf(_.max(tempDist));
              } else {
                  if (dist < tempDist[worstIdx]) {
                      tempDist[worstIdx] = dist;
                      result[worstIdx] = agent;
                      worstIdx = tempDist.indexOf(_.max(tempDist));
                  }
              }
          }
      }

      idx += 1;
  }

    return result;
};

module.exports = {
  random: random,
  randomColor: randomColor,
  randomRGBColor: randomRGBColor,
  flipCoin: flipCoin,
  arrayMean: arrayMean,
  kNearest: kNearest,
  randomId: randomId
}