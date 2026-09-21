import { toast as sonnerToast } from "sonner";

type ToastInput = {
  title: string;
  description?: string;
};

export function useToast() {
  const toast = ({ title, description }: ToastInput) => {
    sonnerToast(title, description ? { description } : undefined);
  };

  return { toast };
}
