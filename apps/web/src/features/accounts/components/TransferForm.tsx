import { Form, Formik } from "formik";
import type { Account } from "@meridia/shared";
import type { TransferFormValues } from "../types";
import type { buildTransferValidationSchema } from "../validations";
import { TransferFormContent } from "./TransferFormContent";

interface TransferFormProps {
  accounts: Account[];
  initialValues: TransferFormValues;
  validationSchema: ReturnType<typeof buildTransferValidationSchema>;
  onSubmit: (values: TransferFormValues) => Promise<void>;
  isPending: boolean;
  onClose: () => void;
}

export const TransferForm = ({
  accounts,
  initialValues,
  validationSchema,
  onSubmit,
  isPending,
  onClose,
}: TransferFormProps) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}>
    <Form>
      <TransferFormContent
        accounts={accounts}
        isPending={isPending}
        onClose={onClose}
      />
    </Form>
  </Formik>
);
