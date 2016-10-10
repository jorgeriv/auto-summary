'use strict';

const fs = require('fs');
const ignoreList = require('./dictionary/ignore-list');

fs.readFile('./build-your-own-summary-tool.txt', 'utf8', function(err, file){
  if(err){
    return console.error(err);
  }
  let paragraphs = splitPharagraphs(file);
  let tokens = [];
  paragraphs.forEach(function(paragraph){
    let _tokens = tokenize(paragraph);
    console.log(_tokens);
    tokens = [...tokens, ..._tokens];
  });
  let rank = countTokens(tokens);
  console.log(rank);
});

function splitPharagraphs(text){
  let paragraphs = text.split('\n');
  paragraphs = paragraphs.filter(function(line){
    return line.length > 1;
  });
  return paragraphs;
}

function tokenize(paragraph){
  let regexp = /\W+/g;
  let tokens = paragraph.split(regexp);
  tokens = tokens.map(function(token){
    return token.toLowerCase();
  });
  tokens = tokens.filter(function(token){
    return Boolean(ignoreList.every(function(word){
      return word !== token;
    }));
  });
  return tokens;
}

function countTokens(tokens){
  let obj = {};
  let arr = [];
  tokens.forEach(function(token){
    if(obj[token]){
      obj[token] += 1;
    } else {
      obj[token] = 1;
    }
  });
  Object.keys(obj).forEach(function(key){
    arr.push({keyword: key, count: obj[key]});
  });
  arr = arr.sort(function(current, next){
    if(current.count > next.count) return 1;
    if(current.count < next.count) return -1;
    return 0;
  });

  return arr;
}
