import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, revoke } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";

(async() => {
    const connection = new Connection(clusterApiUrl("devnet"));

    const user = getKeypairFromEnvironment("SECRET_KEY");

    const TOKEN_MINT_ADDRESS = "8gUvZeQc1juH7fhbYYAoMmEBeVSudb2Y7HsTHcKK1Fvi";

    console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`);
 
    try {
        const tokenMintAddress = new PublicKey(TOKEN_MINT_ADDRESS);

        const userTOkenAddress = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            tokenMintAddress,
            user.publicKey,
        );

        const revokeTransactionSignature = await revoke(
            connection,
            user,
            userTOkenAddress.address,
            user.publicKey
        );

        const explorerLink = getExplorerLink("transaction", revokeTransactionSignature, "devnet");
        console.log(`✅ Revoke Delegate Transaction: ${explorerLink}`);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();