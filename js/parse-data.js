/* 
Copyright 2023 Солодовник Игорь Николаевич, Симоновский Даниил Леонидович, Козырев Даниил Владимирович, Ануфриева Виктория Дмитриевна

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

let dataJson = null;

const getData = (onSuccess, onError) =>
  fetch('https://getthecontact.space//posts/data.json', {
    method: 'GET',
    credentials: 'same-origin',
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((data) => {
      dataJson = data;
      onSuccess();
    })
    .catch((err) => {
      onError(err);
    });

const getCountObj = () => ({
  'seller_tactic': dataJson.seller.tactic.length,
  'buyer_tactic': dataJson.buyer.tactic.length,
  'national': dataJson.buyer.national_short.length,
  'situation': dataJson.seller.goal.length
});

const toBits = (num) => Math.ceil(Math.log2(num));

const getCountBitObj = () => ({
  'seller_tactic': toBits(dataJson.seller.tactic.length),
  'buyer_tactic': toBits(dataJson.buyer.tactic.length),
  'national': toBits(dataJson.buyer.national_short.length),
  'situation': toBits(dataJson.seller.goal.length)
});

const getCodeLen = () => {
  let length = 0;
  Object.entries(getCountObj()).forEach(([, value]) => {
    length += toBits(value);
  });
  return Math.ceil(length / 3);
};

const generateSymbolCode = (len) => {
  const randomNum = Math.floor(Math.random() * len);
  const binaryNum = randomNum.toString(2).padStart(toBits(len), '0');
  return binaryNum;
};

const generateCode = () => {
  const countObj = getCountObj(dataJson);
  const binaryCode = `${generateSymbolCode(countObj['seller_tactic'])}${
    generateSymbolCode(countObj['buyer_tactic'])}${
    generateSymbolCode(countObj['national'])}${
    generateSymbolCode(countObj['situation'])}`;
  return parseInt(binaryCode, 2).toString(8).padStart(getCodeLen(), '0');
};

const getMaxCodeDec = () => {
  const countObj = getCountObj(dataJson);
  const binaryCode = `${(countObj['seller_tactic'] - 1).toString(2)}${
    (countObj['buyer_tactic'] - 1).toString(2)}${
    (countObj['national'] - 1).toString(2)}${
    (countObj['situation'] - 1).toString(2)}`;
  return parseInt(binaryCode, 2);
};

const getObjByCode = (code) => {
  let codeDec = parseInt(code, 8);
  const lenInDec = getCountObj();
  const lenInBits = getCountBitObj();
  const cardsNumber = {};
  for (const element of ['situation', 'national', 'buyer_tactic', 'seller_tactic']) {
    const mask = Math.pow(2, lenInBits[element]) - 1;
    cardsNumber[element] = codeDec & mask;
    // Проверка что число подходит
    if (cardsNumber[element] >= lenInDec[element]) {
      return null;
    }
    codeDec >>= lenInBits[element];
  }
  return {
    'seller': {
      'tactic': dataJson['seller']['tactic'][cardsNumber['seller_tactic']],
      'goal': dataJson['seller']['goal'][cardsNumber['situation']],
      'national_all': dataJson['seller']['national_all'][cardsNumber['national']]
    },
    'buyer': {
      'tactic': dataJson['buyer']['tactic'][cardsNumber['buyer_tactic']],
      'goal': dataJson['buyer']['goal'][cardsNumber['situation']],
      'national_short': dataJson['buyer']['national_short'][cardsNumber['national']]
    },
    'both': {
      'start_situation': dataJson['both']['start_situation'][cardsNumber['situation']]
    }
  };
};

export { generateCode, getMaxCodeDec, getCodeLen, getObjByCode, getData };
