# SPL Token and MPL Core NFT

This project uses Solana devnet to:

1. Create an SPL token, mint 100 tokens, and send 10 tokens to another wallet.
2. Mint an NFT with MPL Core.
3. Update the NFT name and metadata.
4. Transfer the NFT to another wallet (optional).
5. Burn the NFT and recover the available rent (optional).

## Setup

Install Node.js 22+ and the Solana CLI. Then run:

```sh
npm install
solana-keygen new --outfile wallet.json
solana-keygen new --outfile recipient.json
solana config set --url devnet
solana airdrop 2 --keypair wallet.json
solana airdrop 1 --keypair recipient.json
solana-keygen pubkey recipient.json
```

Copy the recipient address printed by the last command. If the airdrop does not work, use the [Solana Faucet](https://faucet.solana.com/).

Do not commit or share the wallet JSON files.

## Create and transfer an SPL token

Replace `RECIPIENT_ADDRESS` with the recipient wallet address:

```sh
npm run token -- RECIPIENT_ADDRESS
```

This creates a token with 6 decimals, mints 100 tokens, and sends 10 to the recipient. The main wallet keeps the other 90 tokens.

## Mint an NFT

The NFT image and metadata files are in the `assets` folder. Upload this project to a public GitHub repository so the image and metadata URLs can be accessed.

Check that the URLs in these files point to your repository:

- `assets/metadata.json`
- `assets/metadata-updated.json`

Use the public raw URL of `metadata.json` to mint the NFT:

```sh
npm run nft -- mint INITIAL_METADATA_URL
```

The command prints the NFT asset address. Save it for the next steps. The main wallet is both the owner and update authority.

## Update the NFT

Use the asset address and the public raw URL of `metadata-updated.json`:

```sh
npm run nft -- update ASSET_ADDRESS UPDATED_METADATA_URL
```

This updates the NFT name and metadata URI. The main wallet signs the transaction as the update authority.

## Transfer the NFT (optional)

```sh
npm run nft -- transfer ASSET_ADDRESS RECIPIENT_ADDRESS
```

The recipient wallet becomes the new owner. The main wallet stays as the update authority.

## Burn the NFT (optional)

If the NFT was transferred, burn it with the recipient wallet:

```sh
npm run nft -- burn ASSET_ADDRESS recipient.json
```

If the NFT was not transferred, use the main wallet:

```sh
npm run nft -- burn ASSET_ADDRESS wallet.json
```

Burning permanently destroys the NFT and returns the recoverable rent to its owner.

## Check the code

```sh
npm run check
```

You can view the addresses and transaction signatures on [Solana Explorer](https://explorer.solana.com/?cluster=devnet). Make sure the selected network is devnet.
