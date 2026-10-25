import { useMemo } from "react";
import type { Account } from "@meridia/shared";
import {
  getDestinationAccounts,
  getSourceAccounts,
  toAccountOption,
} from "../utils/transfer";

export const useTransferAccountOptions = (
  accounts: Account[],
  fromAccountId: string,
) => {
  const sourceAccounts = useMemo(() => getSourceAccounts(accounts), [accounts]);
  const sourceAccount = sourceAccounts.find(
    (account) => account.id === fromAccountId,
  );
  const destinationAccounts = useMemo(
    () => getDestinationAccounts(accounts, sourceAccount),
    [accounts, sourceAccount],
  );
  const sourceOptions = useMemo(
    () => sourceAccounts.map((account) => toAccountOption(account)),
    [sourceAccounts],
  );
  const destinationOptions = useMemo(
    () => destinationAccounts.map((account) => toAccountOption(account)),
    [destinationAccounts],
  );

  return {
    sourceAccounts,
    sourceAccount,
    destinationAccounts,
    sourceOptions,
    destinationOptions,
  };
};
