import { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

const ARC_CHAIN_ID = 5042002;

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();

  const { connect, connectors } = useConnect();

  const { disconnect } = useDisconnect();

  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected) {
      switchChain({
        chainId: ARC_CHAIN_ID,
      });
    }
  }, [isConnected]);

  if (isConnected) {
    return (
      <button
        className="connect-btn"
        onClick={() => disconnect()}
      >
        {address?.slice(0, 6)}...
        {address?.slice(-4)}
      </button>
    );
  }

  return (
    <button
      className="connect-btn"
      onClick={() =>
        connect({
          connector: connectors[0],
        })
      }
    >
      Connect Wallet
    </button>
  );
}