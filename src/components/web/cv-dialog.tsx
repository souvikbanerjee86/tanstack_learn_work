import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function CVDialog({ isOpen, setIsOpen, fileUrl }: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    fileUrl: string
}) {
    return (<Dialog open={isOpen} onOpenChange={setIsOpen}>

        <DialogContent className='sm:max-w-[50vw]'>
            <DialogHeader>
                <DialogTitle>Candidate Resume</DialogTitle>

            </DialogHeader>
            <div className="no-scrollbar -mx-4 max-h-[90vh] overflow-y-auto px-4">

                <p key={fileUrl} className="mb-4 leading-normal">
                    <iframe
                        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                        style={{ width: "100%", height: "600px" }}
                        frameBorder="0">
                    </iframe>
                </p>

            </div>
        </DialogContent>
    </Dialog>)

} 