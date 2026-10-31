import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { burn, create, fetchAsset, mplCore, transfer, update } from '@metaplex-foundation/mpl-core';
import { loadWallet } from './wallet.js';

const [command, addressOrUri, value, walletPath] = process.argv.slice(2);
if (!['mint', 'update', 'transfer', 'burn'].includes(command) || !addressOrUri ||
  (['update', 'transfer'].includes(command) && !value)) {
  throw new Error('Use mint <uri>, update <asset> <uri>, transfer <asset> <recipient>, or burn <asset> <owner-keypair.json>');
}

// After a transfer, burning requires the new owner's signature.
const wallet = loadWallet(command === 'burn' ? value : walletPath);
const umi = createUmi('https://api.devnet.solana.com').use(mplCore());
umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(wallet.secretKey)));

switch (command) {
  case 'mint': {
    const asset = generateSigner(umi);
    const result = await create(umi, {
      asset,
      name: 'turbin3',
      uri: addressOrUri,
      owner: umi.identity.publicKey,
      updateAuthority: umi.identity.publicKey,
    }).sendAndConfirm(umi);
    console.log('Asset:', asset.publicKey);
    console.log('Transaction:', base58.deserialize(result.signature)[0]);
    break;
  }
  case 'update': {
    const asset = await fetchAsset(umi, publicKey(addressOrUri));
    const result = await update(umi, {
      asset, name: 'turbin3', uri: value!, authority: umi.identity,
    }).sendAndConfirm(umi);
    console.log('Updated:', base58.deserialize(result.signature)[0]);
    break;
  }
  case 'transfer': {
    const asset = await fetchAsset(umi, publicKey(addressOrUri));
    const result = await transfer(umi, {
      asset, newOwner: publicKey(value!), authority: umi.identity,
    }).sendAndConfirm(umi);
    console.log('Transferred:', base58.deserialize(result.signature)[0]);
    break;
  }
  case 'burn': {
    const asset = await fetchAsset(umi, publicKey(addressOrUri));
    const result = await burn(umi, { asset, authority: umi.identity }).sendAndConfirm(umi);
    console.log('Burned:', base58.deserialize(result.signature)[0]);
    break;
  }
}
