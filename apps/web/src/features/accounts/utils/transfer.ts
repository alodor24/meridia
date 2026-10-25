import { TRANSFERABLE_ACCOUNT_TYPES } from "@meridia/shared";
import type { Account } from "@meridia/shared";
import { formatCurrency } from "@/utils/format";
import type {
  CreateTransferPayload,
  TransferAccountOption,
  TransferFormValues,
} from "../types";

export const isTransferableAccount = (account: Account): boolean =>
  TRANSFERABLE_ACCOUNT_TYPES.some((type) => type === account.type);

export const getSourceAccounts = (accounts: Account[]): Account[] =>
  accounts.filter(
    (account) => isTransferableAccount(account) && account.balance > 0,
  );

export const getDestinationAccounts = (
  accounts: Account[],
  source?: Account,
): Account[] =>
  source
    ? accounts.filter(
        (account) =>
          isTransferableAccount(account) &&
          account.id !== source.id &&
          account.currency === source.currency,
      )
    : [];

export const toAccountOption = (account: Account): TransferAccountOption => ({
  value: account.id,
  label: `${account.name} · ${formatCurrency(account.balance, account.currency)}`,
});

export const getInitialTransferValues = (
  accounts: Account[],
): TransferFormValues => {
  const initialSource = getSourceAccounts(accounts)[0];
  const initialDestination = getDestinationAccounts(accounts, initialSource)[0];

  return {
    fromAccountId: initialSource?.id ?? "",
    toAccountId: initialDestination?.id ?? "",
    amount: "",
    note: "",
  };
};

export const toCreateTransferPayload = (
  values: TransferFormValues,
): CreateTransferPayload => ({
  fromAccountId: values.fromAccountId,
  toAccountId: values.toAccountId,
  amount: Number(values.amount),
  note: values.note.trim() || undefined,
});
