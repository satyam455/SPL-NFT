import { readFileSync } from 'node:fs';
import { Connection, Keypair } from '@solana/web3.js';

export const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export function loadWallet(path = 'wallet.json') {
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(path, 'utf8'))));
}
