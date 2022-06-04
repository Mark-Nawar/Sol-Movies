import BigNumber from "bignumber.js";

const calculatePrice = (solPrice, qty) => {
  let amount = new BigNumber(solPrice);
  const productQuantity = new BigNumber(qty);
  const price = amount.multipliedBy(productQuantity);
  return price;
}

export default calculatePrice;