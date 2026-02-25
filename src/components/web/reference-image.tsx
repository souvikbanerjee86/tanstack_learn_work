import { Upload, UploadCloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";


interface ReferenceImageProps {
    referenceImage: string | null
    fileInputRef: React.RefObject<HTMLInputElement | null>
    handleReferenceImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function ReferenceImage({ referenceImage, fileInputRef, handleReferenceImageUpload }: ReferenceImageProps) {
    return (
        <div className="space-y-6">
            <Card className="flex flex-col h-full bg-card/50 backdrop-blur border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" />
                        Reference Image
                    </CardTitle>
                    <CardDescription>
                        Upload an official ID or reference photo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20">
                    {referenceImage ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary/20 shadow-inner">
                            <img src={referenceImage} alt="Reference" className="w-full h-full object-contain bg-black/5" />
                            <div className="absolute inset-0 bg-linear-to-t from-background/80 pt-10 to-transparent flex items-end justify-center p-4">
                                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    Change File
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full aspect-video border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm font-medium mb-1">Click to upload reference image</p>
                            <p className="text-xs text-muted-foreground">JPEG, PNG up to 5MB</p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleReferenceImageUpload}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

