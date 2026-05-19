import { useMarkets } from "../hooks/useMarkets";
import MarketCard from "./MarketCard";

export default function MarketList({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const { markets, marketCount, isLoading } = useMarkets();

  if (isLoading) return <p className="empty-text">Đang tải markets...</p>;

  if (marketCount === 0 || markets.length === 0) {
    return (
      <p className="empty-text">
        Chưa có market nào. Admin cần tạo market trước.
      </p>
    );
  }

  const filteredMarkets =
    activeCategory === "All"
      ? markets
      : markets.filter((market) => market.category === activeCategory);

  if (filteredMarkets.length === 0) {
    return (
      <p className="empty-text">
        Không có market trong mục {activeCategory}.
      </p>
    );
  }

  return (
    <div className="markets-grid">
      {filteredMarkets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}