import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~components/ui/alert-dialog"

export default function AlertPopup({
  children,
  title,
  description,
  onCancel,
  onContinue
}) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {title || "Are you absolutely sure?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {description || "This action cannot be undone. "}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => (onCancel ? onCancel() : null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => (onContinue ? onContinue() : null)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
