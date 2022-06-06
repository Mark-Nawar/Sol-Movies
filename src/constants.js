import { PublicKey } from '@solana/web3.js';

const shopAddress = process.env.REACT_APP_SHOP_PUB_KEY;
export const SHOP_ADDRESS = new PublicKey(shopAddress);