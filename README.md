# SPL Token and MPL Core NFT

Simple TypeScript scripts for Solana **devnet**:

1. Create an SPL token, mint 100 tokens, and transfer 10 to another wallet.
2. Mint an MPL Core NFT.
3. Update its name and metadata URI using the update authority.
4. Optionally transfer the NFT to another wallet.
5. Optionally burn it and reclaim recoverable rent.

## Setup

Install Node.js 22+ and the Solana CLI. Run commands from this folder.

```sh
npm install
solana-keygen new --outfile wallet.json
solana-keygen new --outfile recipient.json
solana config set --url devnet
solana airdrop 2 --keypair wallet.json
solana airdrop 1 --keypair recipient.json
solana-keygen pubkey recipient.json
```

Save the recipient public address printed by the last command. If the airdrop is rate limited, use [Solana Faucet](https://faucet.solana.com/). Keep both keypair files private; never commit them or share their contents.

## 1. Mint and transfer an SPL token

Replace `RECIPIENT_ADDRESS` with that public address:

```sh
npm run token -- RECIPIENT_ADDRESS
```

The token has six decimal places. The script prints its mint address and transaction signatures. Your wallet keeps 90 tokens and the recipient gets 10. Running this command again creates a new mint.

## 2. Mint a Core NFT

Your supplied image is included as `assets/nft.jpg` (the original JFIF/JPEG bytes are preserved). The two metadata files are included in `assets/` too.

In both JSON files, replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub username and public repository name. The example URLs assume the `main` branch. Push the image and JSON files to that repository so their raw URLs are publicly accessible.

Initial `metadata.json`:

```json
{
  "name": "turbin3",
  "symbol": "T3",
  "description": "My first MPL Core NFT on Solana devnet.",
  "image": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPOSITORY/main/assets/nft.jpg"
}
```

Updated `metadata-updated.json`:

```json
{
  "name": "turbin3",
  "symbol": "T3",
  "description": "Metadata updated by the update authority.",
  "image": "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPOSITORY/main/assets/nft.jpg"
}
```

Replace `INITIAL_METADATA_URL` with the actual public URL of the initial JSON:

```sh
npm run nft -- mint INITIAL_METADATA_URL
```

Save the printed asset address as `ASSET_ADDRESS`. Your wallet is both owner and update authority. The script stores the metadata URL on chain; it does not upload files.

## 3. Update the NFT

Use the public URL of the updated JSON:

```sh
npm run nft -- update ASSET_ADDRESS UPDATED_METADATA_URL
```

This sets the on-chain name to `turbin3` and replaces the metadata URI. `wallet.json` signs as update authority. The symbol `T3` is stored in the JSON metadata.

## 4. Transfer ownership (optional)

```sh
npm run nft -- transfer ASSET_ADDRESS RECIPIENT_ADDRESS
```

The recipient becomes the owner. The original wallet remains the update authority.

## 5. Burn and reclaim rent (optional)

After transferring, sign with the recipient wallet:

```sh
npm run nft -- burn ASSET_ADDRESS recipient.json
```

If you skipped the transfer, use `wallet.json` instead. Burning permanently destroys the NFT. Core returns recoverable asset rent to its owner; transaction fees are still charged and a small account record remains. Hosted metadata and images are not deleted.

## Check and submission

```sh
npm run check
```

View the printed addresses and signatures in [Solana Explorer](https://explorer.solana.com/?cluster=devnet), with the cluster set to devnet. Record the mint, asset address, and transaction links before burning.

Push this folder to your repository and submit its URL. Publish a thread, article, or tutorial on X, LinkedIn, or YouTube and submit that public link too. Explain what you ran, what you learned about token accounts and NFT ownership/update authority, and how tokens or editable NFTs could support rewards, memberships, or game items. Include your actual devnet transaction links.

## References

- [Solana SPL token basics](https://solana.com/docs/tokens/basics)
- [Metaplex Core JavaScript SDK](https://www.metaplex.com/docs/smart-contracts/core/sdk/javascript)
