import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

interface FaceDetectionSuccessAlertProps {
    result: { score?: number; message: string; match?: boolean }
}
export const FaceDetectionSuccessAlert = ({ result }: FaceDetectionSuccessAlertProps) => {
    return (
        <Alert variant={result.match ? "default" : "destructive"} className={`border-2 animate-in fade-in zoom-in-95 ${result.match ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400' : ''}`}>
            {result.match ? <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" /> : <AlertCircle className="h-5 w-5" />}
            <AlertTitle className="text-lg font-semibold">{result.match ? 'Verification Successful' : 'Verification Failed'}</AlertTitle>
            <AlertDescription className="mt-2 text-base flex flex-col gap-2">
                <span>{result.message}</span>
                {result.score !== undefined && (
                    <span className="inline-flex items-center rounded-md bg-background/50 px-2 py-1 text-sm font-medium ring-1 ring-inset ring-foreground/10 w-fit">
                        Confidence Score: <strong className="ml-1">{result.score.toFixed(1)}%</strong>
                    </span>
                )}
            </AlertDescription>
        </Alert>
    )
}