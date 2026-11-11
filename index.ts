import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Pumpg, PumpgIDL } from "./types/pumpg";
import { clusterApiUrl, Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
const commitment: Commitment = "confirmed";

(async () =>{
    const connection = new Connection(clusterApiUrl("devnet"));
    const keypair = Keypair.generate();
    const wallet = new anchor.Wallet(keypair);

    const provider = new anchor.AnchorProvider(connection, wallet);

    const program = new Program<Pumpg>(PumpgIDL,provider);
    const BONDING_CURVE:string = "bonding_curve";

    const mint = new anchor.web3.PublicKey("27EkoCymoPaQViRrtBxxjfsscn1BnYNWKZ5PxLah4xdS");

    const bonding_curve = PublicKey.findProgramAddressSync(
      [Buffer.from(BONDING_CURVE), mint.toBuffer()],
      program.programId
    )[0];

    console.log("bonding curve pda:", bonding_curve);

    // get initial bonding curve
    const initialBondingCurve_acc = await program.account.bondingCurve.fetch(
      bonding_curve
    );

    console.log("initial bonding curve  real sol-> ", (initialBondingCurve_acc.realSolReserve.toNumber())/LAMPORTS_PER_SOL); // 0
    console.log("initial bonding curve  virtual sol-> ", (initialBondingCurve_acc.virtualSolReserve.toNumber())/LAMPORTS_PER_SOL); // 30
    console.log("initial bonding curve  real token-> ", (initialBondingCurve_acc.realTokenReserve.toNumber())/1000000); // 793100000000000
    console.log("initial bonding curve  virtual token -> ", (initialBondingCurve_acc.virtualTokenReserve.toNumber())/1000000); // 30
    console.log("initial bonding curve  total token suppy-> ", (initialBondingCurve_acc.tokenTotalSupply.toNumber())/1000000); // 30
    console.log("initial bonding curve  complere-> ", (initialBondingCurve_acc.complete)); // 30

    console.log("token market cap:",((initialBondingCurve_acc.virtualSolReserve.mul(initialBondingCurve_acc.tokenTotalSupply)).div(initialBondingCurve_acc.virtualTokenReserve)).toNumber()/LAMPORTS_PER_SOL)

    console.log("token price:",((initialBondingCurve_acc.virtualSolReserve.mul(initialBondingCurve_acc.tokenTotalSupply)).div(initialBondingCurve_acc.virtualTokenReserve)).toNumber()/LAMPORTS_PER_SOL)


})();


// const getBuyToken = async (mintadd: PublicKey, solIn:anchor.BN) =>{
//     const connection = new Connection("https://api.devnet.solana.com");
//     const keypair = Keypair.generate();
//     const wallet = new anchor.Wallet(keypair);

//     const provider = new anchor.AnchorProvider(connection, wallet);

//     const program = new Program<Pumpg>(PumpgIDL,provider);
//     const BONDING_CURVE:string = "bonding_curve";

//     const mint = new anchor.web3.PublicKey(mintadd);

//     const bonding_curve = PublicKey.findProgramAddressSync(
//       [Buffer.from(BONDING_CURVE), mint.toBuffer()],
//       program.programId
//     )[0];

//     console.log("bonding curve pda:", bonding_curve);

//     // get initial bonding curve
//     const initialBondingCurve_acc = await program.account.bondingCurve.fetch(
//       bonding_curve
//     );

//     console.log("initial bonding curve  real sol-> ", (initialBondingCurve_acc.realSolReserve.toNumber())/LAMPORTS_PER_SOL); // 0
//     console.log("initial bonding curve  virtual sol-> ", (initialBondingCurve_acc.virtualSolReserve.toNumber())/LAMPORTS_PER_SOL); // 30
//     console.log("initial bonding curve  real token-> ", (initialBondingCurve_acc.realTokenReserve.toNumber())/1000000); // 793100000000000
//     console.log("initial bonding curve  virtual token -> ", (initialBondingCurve_acc.virtualTokenReserve.toNumber())/1000000); // 30
//     console.log("initial bonding curve  total token suppy-> ", (initialBondingCurve_acc.tokenTotalSupply.toNumber())/1000000); // 30
//     console.log("complete :", initialBondingCurve_acc.complete);
//     // let v_sol = initialBondingCurve_acc.virtualSolReserve;
//     // let denominator = v_sol.add(solIn); 
//     // console.log("denominator : ",denominator.toNumber());
// };

// getBuyToken(new PublicKey("3DmqxdkLfVQJxQNXuKjvQ4GGMGXUkbJjNb5Q9ne66Cvk"), new anchor.BN(LAMPORTS_PER_SOL));
