import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { verifyFaceRecognition } from '@/lib/server-function'

export const Route = createFileRoute('/dashboard/detection/')({
  component: FaceRecognitionScreen,
})

function FaceRecognitionScreen() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; matchScore?: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please ensure you have granted permission.")
    }
  }

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const captureImage = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        // Convert to base64
        const base64Image = canvas.toDataURL('image/jpeg')
        setCapturedImage(base64Image)
        stopCamera()
      }
    }
  }

  const handleReferenceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReferenceImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerify = async () => {
    if (!capturedImage || !referenceImage) {
      setError("Both captured image and reference image are required for verification.")
      return
    }

    try {
      setIsProcessing(true)
      setError(null)
      setResult(null)

      const response = await verifyFaceRecognition({
        capturedImageBase64: capturedImage,
        referenceImageBase64: referenceImage
      })

      setResult(response)
    } catch (err) {
      console.error("Verification failed:", err)
      setError("An error occurred during face recognition verification.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetProcess = () => {
    setCapturedImage(null)
    setReferenceImage(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Face Recognition Verification</h1>
        <p className="text-muted-foreground">
          Capture your face and provide a reference image to verify identity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verification Area */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center p-4">
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

        {/* Reference Image Area */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 pt-10 to-transparent flex items-end justify-center p-4">
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
      </div>

      {/* Action and Status Area */}
      <div className="max-w-2xl mx-auto space-y-6">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className={`border-2 animate-in fade-in zoom-in-95 ${result.success ? 'border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400' : ''}`}>
            {result.success ? <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" /> : <AlertCircle className="h-5 w-5" />}
            <AlertTitle className="text-lg font-semibold">{result.success ? 'Verification Successful' : 'Verification Failed'}</AlertTitle>
            <AlertDescription className="mt-2 text-base flex flex-col gap-2">
              <span>{result.message}</span>
              {result.matchScore !== undefined && (
                <span className="inline-flex items-center rounded-md bg-background/50 px-2 py-1 text-sm font-medium ring-1 ring-inset ring-foreground/10 w-fit">
                  Confidence Score: <strong className="ml-1">{result.matchScore.toFixed(1)}%</strong>
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {result || (capturedImage && referenceImage) ? (
            <Button
              size="lg"
              variant="outline"
              onClick={resetProcess}
              className="w-full sm:w-auto min-w-[140px]"
            >
              Start Over
            </Button>
          ) : null}

          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[200px] shadow-lg hover:shadow-primary/25 relative overflow-hidden group"
            disabled={!capturedImage || !referenceImage || isProcessing}
            onClick={handleVerify}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isProcessing ? "Verifying Identity..." : "Verify Identity"}
          </Button>
        </div>
      </div>
    </div>
  )
}
