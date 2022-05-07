export function priceFormat(price: number | string): string {
  let returnPrice = price;
  if (typeof price === 'string') {
    returnPrice = Number.parseFloat(price);
  }
  return `${Number(returnPrice).toFixed(2)}`;
}

export function inputPriceConvert(price: string): string {
  let newPrice = price;
  if (price.indexOf('.') < 0) {
    // はじめの入力 undefine => 0.01
    newPrice = (Number(price) / 100).toFixed(2);
  } else if (price.indexOf('.') === price.length - 2) {
    // backspace  12.34 => 1.23
    newPrice = (Number(price) / 10).toFixed(2);
  } else {
    // 通常入力　0.01 => 0.12..   123.45 => 1234.56
    newPrice = ((Number(price) * 100) / 10).toFixed(2);
  }

  return `${newPrice}`;
}
