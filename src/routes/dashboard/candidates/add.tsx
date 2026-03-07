import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft, FileCheck, FileUp, ImageIcon, Send, Trash2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

export const Route = createFileRoute('/dashboard/candidates/add')({
    component: RouteComponent,
})

function RouteComponent() {
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [imgBase64, setImgBase64] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImgBase64(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // 2. Standard Form Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUploading(true)

        const formData = new FormData(e.currentTarget)

        // Construct the payload matching your API screenshot
        const payload = {
            job_id: formData.get("job_id"),
            job_name: formData.get("job_name"),
            candidate_name: formData.get("candidate_name"),
            candidate_email: formData.get("candidate_email"),
            file: cvFile, // Raw file for multipart
            profile_image: imgBase64, // Base64 string
        }

        console.log("Ready for API:", payload)

        // Simulate delay
        await new Promise((r) => setTimeout(r, 1500))
        setIsUploading(false)
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* 1. Back Button - Positioned Top Left */}
            <div className="flex items-center justify-start">
                <Link to='/dashboard/candidates'>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 pl-2 text-muted-foreground hover:text-foreground"

                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <Card className="shadow-md border-muted/60 dark:bg-card">
                <CardHeader>
                    <CardTitle className="text-xl">Candidate Application</CardTitle>
                    <CardDescription>Upload candidate details and CV for processing.</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Main Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="job_id">Job ID</Label>
                                <Input id="job_id" name="job_id" placeholder="Data-Engineer-001" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job_name">Job Name</Label>
                                <Input id="job_name" name="job_name" placeholder="Data Engineer" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="candidate_name">Candidate Name</Label>
                                <Input id="candidate_name" name="candidate_name" placeholder="Souvik Banerjee" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="candidate_email">Candidate Email</Label>
                                <Input id="candidate_email" name="candidate_email" type="email" placeholder="souvik@gmail.com" required />
                            </div>
                        </div>

                        <hr className="border-muted/50" />

                        {/* File Upload Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image to Base64 Field */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" /> Profile Image (Base64)
                                </Label>
                                <div className="relative">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-input transition-colors">
                                        {imgBase64 ? (
                                            <img src={imgBase64} alt="Preview" className="h-full w-auto object-contain p-2" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <FileUp className="w-8 h-8 mb-2" />
                                                <p className="text-[10px] uppercase font-bold tracking-tighter">Upload Image</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                    {imgBase64 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                            onClick={() => setImgBase64(null)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* CV File Upload Field */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <FileCheck className="h-4 w-4" /> Resume / CV (Multipart)
                                </Label>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                        className="cursor-pointer bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-1">
                                        Accepted: PDF, DOCX
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/10 border-t py-4 flex justify-between items-center">
                        <p className="text-xs text-muted-foreground italic">
                            Check all fields before submitting.
                        </p>
                        <Button type="submit" disabled={isUploading} className="min-w-[120px]">
                            {isUploading ? "Processing..." : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> Submit
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
