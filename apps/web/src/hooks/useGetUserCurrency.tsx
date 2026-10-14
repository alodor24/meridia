import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const useGetUserCurrency = () => {
  const { data: user } = useCurrentUser();
  const currency = user?.currency ?? "USD";

  return { currency };
};

export default useGetUserCurrency;
