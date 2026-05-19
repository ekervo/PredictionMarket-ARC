import {
  createConfig,
  http,
} from "wagmi";

import {
  injected,
} from "wagmi/connectors";

import {
  arcTestnet,
} from "./arcTestnet";

export const wagmiConfig =
  createConfig({
    chains: [arcTestnet],

    connectors: [
      injected(),
    ],

    transports: {
      [arcTestnet.id]:
        http(),
    },
  });