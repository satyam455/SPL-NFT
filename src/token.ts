import { PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transferChecked } from '@solana/spl-token';
import { connection, loadWallet } from './wallet.js';

const recipientAddress = process.argv[2];
if (!recipientAddress) throw new Error('Usage: npm run token -- <recipient-address>');
const recipient = new PublicKey(recipientAddress);
const wallet = loadWallet();
const decimals = 6;

const mint = await createMint(connection, wallet, wallet.publicKey, null, decimals);
console.log('Mint:', mint.toBase58());

const senderAccount = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
const recipientAccount = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, recipient);

const mintSignature = await mintTo(connection, wallet, mint, senderAccount.address, wallet, 100n * 10n ** 6n);
console.log('Minted 100 tokens:', mintSignature);

const transferSignature = await transferChecked(
  connection, wallet, senderAccount.address, mint, recipientAccount.address,
  wallet, 10n * 10n ** 6n, decimals,
);
console.log('Transferred 10 tokens:', transferSignature);
