import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { approve, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import "dotenv/config";

(async() => {
    const connection = new Connection(clusterApiUrl("devnet"));

    const TOKEN_DECIMALS = 2;

    const DELEGATE_AMOUNT = 50;

    const MINOR_UNITS_PER_MAJOR_UNITS = 10 ** TOKEN_DECIMALS;
 
    const user = getKeypairFromEnvironment("SECRET_KEY");

    console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`);

    const delegatePublicKey = new PublicKey(SystemProgram.programId);

    const tokenMintAddress = new PublicKey("8gUvZeQc1juH7fhbYYAoMmEBeVSudb2Y7HsTHcKK1Fvi");

    try {
        const userTokenAddress = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            tokenMintAddress,
            user.publicKey
        );

        const approveTransactionSignature = await approve(
            connection, 
            user,
            userTokenAddress.address,
            delegatePublicKey,
            user.publicKey,
            DELEGATE_AMOUNT * MINOR_UNITS_PER_MAJOR_UNITS
        );

        const explorerLink = getExplorerLink("transaction", approveTransactionSignature, "devnet");
        console.log(`✅ Delegate approved. Transaction: ${explorerLink}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    }

})();