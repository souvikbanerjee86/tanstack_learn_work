import { Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
interface FaceVerificationProps {
    capturedImage: string | null,
    setCapturedImage: (image: string | null) => void
    stream: MediaStream | null
    videoRef: React.RefObject<HTMLVideoElement | null>
    startCamera: () => void
    captureImage: () => void
}
export const FaceVerification = ({ capturedImage, setCapturedImage, stream, videoRef, startCamera, captureImage }: FaceVerificationProps) => {
    return (
        <div className="space-y-6">
            <Card className="flex flex-col h-full bg-card/50 backdrop-blur border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Live Capture
                    </CardTitle>
                    <CardDescription>
                        Position your face clearly in the frame and capture.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20">
                    {capturedImage ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary/20 shadow-inner">
                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent flex items-end justify-center p-4">
                                <Button variant="secondary" size="sm" onClick={() => { setCapturedImage(null); startCamera(); }}>
                                    Retake Photo
                                </Button>
                            </div>
                        </div>
                    ) : stream ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-inner">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover scale-x-[-1]"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Camera className="w-8 h-8 text-primary" />
                            </div>
                            <p>Camera is currently off.</p>
                            <Button onClick={startCamera}>Start Camera</Button>
                        </div>
                    )}
                </CardContent>
                {stream && !capturedImage && (
                    <CardFooter className="justify-center border-t border-border/50 pt-6">
                        <Button size="lg" className="w-full sm:w-auto rounded-full shadow-md" onClick={captureImage}>
                            <Camera className="mr-2 h-5 w-5" />
                            Capture Face
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}