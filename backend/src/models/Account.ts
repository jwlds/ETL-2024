import MarketShares from "./MarketShares";
import User from "./User";

type Account = {
    id?: number;
    user: User;
    shares: MarketShares[];
  };

  export default Account;
  