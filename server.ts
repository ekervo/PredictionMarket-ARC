import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const circleDeveloperSdk =
  initiateDeveloperControlledWalletsClient({
    apiKey:
      process.env.CIRCLE_API_KEY!,

    entitySecret:
      process.env.CIRCLE_ENTITY_SECRET!,
  });

const METADATA_URI =
  "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei";

async function waitForTx(id: string) {
  while (true) {
    const res =
      await circleDeveloperSdk.getTransaction({
        id,
      });

    const tx =
      res.data?.transaction;

    const state = tx?.state;

    console.log(
      "Transaction state:",
      state
    );

    if (
      state === "CONFIRMED" ||
      state === "COMPLETE"
    ) {
      return tx;
    }

    if (
      state === "FAILED" ||
      state === "CANCELLED"
    ) {
      throw new Error(
        `Transaction ${state}`
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 5000)
    );
  }
}

app.post(
  "/api/buy",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        userAddress,
        tokenId,
        amount,
      } = req.body;

      if (
        !userAddress ||
        tokenId === undefined ||
        !amount
      ) {
        return res
          .status(400)
          .json({
            error:
              "Missing userAddress, tokenId, or amount",
          });
      }

      console.log(
        "BUY REQUEST:"
      );

      console.log({
        userAddress,
        tokenId,
        amount,
      });

      // Mint directly to user wallet
      const mintResponse =
        await circleDeveloperSdk.createContractExecutionTransaction(
          {
            walletId:
              process.env
                .WALLET_ID!,

            abiFunctionSignature:
              "mintTo(address,uint256,string,uint256)",

            abiParameters: [
              userAddress,

              String(tokenId),

              METADATA_URI,

              String(amount),
            ],

            contractAddress:
              process.env
                .CONTRACT_ADDRESS!,

            fee: {
              type: "level",

              config: {
                feeLevel:
                  "MEDIUM",
              },
            },
          }
        );

      console.log(
        "Mint submitted:"
      );

      console.log(
        JSON.stringify(
          mintResponse.data,
          null,
          2
        )
      );

      const tx =
        await waitForTx(
          mintResponse.data!.id
        );

      return res.json({
        success: true,
        transaction: tx,
      });
    } catch (error) {
      console.error(
        "BUY FAILED:"
      );

      console.error(error);

      return res
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "Buy failed",
        });
    }
  }
);

app.listen(3001, () => {
  console.log(
    "Backend running on http://localhost:3001"
  );
});