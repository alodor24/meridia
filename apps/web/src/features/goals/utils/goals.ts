import type { Account, Goal } from "@meridia/shared";
import { TRANSFERABLE_ACCOUNT_TYPES } from "@meridia/shared";

export const getGoalProgress = (goal: Goal): number => {
  if (goal.targetAmount <= 0) return 0;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
};

export const getGoalRemainingAmount = (goal: Goal): number =>
  Math.max(0, goal.targetAmount - goal.currentAmount);

export const splitGoals = (goals: Goal[]) => ({
  active: goals.filter((goal) => goal.status === "active"),
  completed: goals.filter((goal) => goal.status === "completed"),
});

export const getGoalSavingsAccounts = (accounts: Account[]): Account[] =>
  accounts.filter((account) => account.type === "savings");

export const getGoalReservedAmount = (
  goals: Goal[],
  accountId: string,
): number =>
  goals
    .filter((goal) => goal.status === "active" && goal.accountId === accountId)
    .reduce((total, goal) => total + Math.round(goal.currentAmount * 100), 0) /
  100;

export const getGoalAvailableAmount = (
  account: Account | undefined,
  goals: Goal[],
): number => {
  if (!account) return 0;

  const balanceCents = Math.round(account.balance * 100);
  const reservedCents = Math.round(
    getGoalReservedAmount(goals, account.id) * 100,
  );

  return Math.max(0, (balanceCents - reservedCents) / 100);
};

export const getGoalSourceAccounts = (
  accounts: Account[],
  goal: Goal,
): Account[] =>
  accounts.filter(
    (account) =>
      account.id !== goal.accountId &&
      account.currency === goal.currency &&
      account.balance > 0 &&
      TRANSFERABLE_ACCOUNT_TYPES.some((type) => type === account.type),
  );

export const canContributeToGoal = (
  accounts: Account[],
  goals: Goal[],
  goal: Goal,
): boolean => {
  if (getGoalRemainingAmount(goal) <= 0) return false;

  const account = accounts.find((item) => item.id === goal.accountId);

  return (
    getGoalAvailableAmount(account, goals) > 0 ||
    getGoalSourceAccounts(accounts, goal).some(
      (source) => getGoalAvailableAmount(source, goals) > 0,
    )
  );
};
