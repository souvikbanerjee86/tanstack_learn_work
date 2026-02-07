import { RagProcessRecord } from "@/lib/types";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { format } from 'date-fns'
export function ImportPageCard({ cardDescription, processedCount, footerDescription, processedIndexFiles }:
    { cardDescription: string, processedCount: number, footerDescription: string, processedIndexFiles: RagProcessRecord[] }) {

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription className='text-center'>{cardDescription}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-center">
                    {cardDescription === "Last Processed Index" ? processedIndexFiles[0].date : processedCount}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">

                <div className="text-muted-foreground text-center">
                    {footerDescription} {processedIndexFiles && format(new Date(processedIndexFiles[0].processed_at), "PPPp")}
                </div>
            </CardFooter>
        </Card>
    )
}