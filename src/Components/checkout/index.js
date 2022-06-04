import {
  createQR,
  encodeURL,
  findReference,
  validateTransfer,
  FindReferenceError,
  ValidateTransferError,
} from '@solana/pay';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js'
import { useRef, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import { SHOP_ADDRESS } from '../../constants';
import calculatePrice from '../../utils/calculatePrice';
import './styles/checkout.css';

const Checkout = () => {
  let query = useQuery();
  const reference = useMemo(() => Keypair.generate().publicKey, []);
  const qrRef = useRef(null);
  const navigate = useNavigate()

  // query the fer item id
  const itemId = query.get('id');
  const quantity = query.get('qty');
  const solPrice = query.get('sol-price');

  const amount = calculatePrice(solPrice, quantity);

  console.log(amount, itemId);

  // Get a connection to Solana devnet
  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const connection = new Connection(endpoint)

  // Solana Pay transfer params
  const urlParams = {
    recipient: SHOP_ADDRESS,
    amount,
    reference,
    label: 'Sol Movies',
    message: 'Thanks, Enjoy your movie',
  }

  // Encode the params into the format shown
  const url = encodeURL(urlParams)

  console.log(url)

  useEffect(() => {
    const qr = createQR(url, 512, 'transparent')
    if (qrRef.current && amount.isGreaterThan(0)) {
      qrRef.current.innerHTML = ''
      qr.append(qrRef.current)
    }
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference, {
          finality: 'confirmed',
        })
        // Validate that the transaction has the expected recipient, amount and SPL token
        await validateTransfer(
          connection,
          signatureInfo.signature,
          {
            recipient: SHOP_ADDRESS,
            amount,
            reference,
          },
          { commitment: 'confirmed' }
        )
        navigate('/confirmed');

      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return
        }
        if (e instanceof ValidateTransferError) {
          // Transaction is invalid
          console.error('Transaction is invalid', e)
          return
        }
        console.error('Unknown error', e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, []);




  return (
    <div className='checkout-page'>
      <h1>Amount: {amount.toString()} Sol</h1>
      <div ref={qrRef} />
    </div>
  )
}

export default Checkout;