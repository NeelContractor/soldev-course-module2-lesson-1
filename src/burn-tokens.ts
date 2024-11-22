import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { burn, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";

(async() => {
    const connection = new Connection(clusterApiUrl("devnet"));

    const user = getKeypairFromEnvironment("SECRET_KEY");

    const TOKEN_DECIMALS = 2;

    const BURN_TOKEN = 0.1;

    const TOKEN_MINT_ADDRESS = "8gUvZeQc1juH7fhbYYAoMmEBeVSudb2Y7HsTHcKK1Fvi";

    console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`);
 
    try {
        const tokenMintAddress = new PublicKey(TOKEN_MINT_ADDRESS);

        const userTokenAddress = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            tokenMintAddress,
            user.publicKey
        )

        const burnAmount = BURN_TOKEN * 10 ** TOKEN_DECIMALS;

        const transactionSignature = await burn(
            connection,
            user,
            userTokenAddress.address,
            tokenMintAddress,
            user,
            burnAmount
        )

        const explorerLink = getExplorerLink(
            "transaction",
            transactionSignature,
            "devnet",
          );
         
          console.log(`✅ Burn Transaction: ${explorerLink}`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();