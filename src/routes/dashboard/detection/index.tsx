import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { verifyFaceRecognition } from '@/lib/server-function'
import { ReferenceImage } from '@/components/web/reference-image'
import { FaceVerification } from '@/components/web/face-verification'
import { FaceDetectionSuccessAlert } from '@/components/web/facedetection-success-alert'
import { AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/detection/')({
  component: FaceRecognitionScreen,
})

function FaceRecognitionScreen() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ score?: number; message: string; match?: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Need to sync the ref and stream, since the video element is conditionally rendered
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
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
        data: {
          capturedImageBase64: capturedImage,
          referenceImageBase64: referenceImage
        }
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
        <FaceVerification
          capturedImage={capturedImage}
          setCapturedImage={setCapturedImage}
          stream={stream}
          videoRef={videoRef}
          startCamera={startCamera}
          captureImage={captureImage}
        />

        {/* Reference Image Area */}
        <ReferenceImage
          referenceImage={referenceImage}
          fileInputRef={fileInputRef}
          handleReferenceImageUpload={handleReferenceImageUpload}
        />
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
          <FaceDetectionSuccessAlert result={result} />
        )}

        {result?.match ? <Link to='/dashboard/audio-interview' state={{ score: result.score, match: result.match } as any} className='w-full sm:w-auto min-w-[200px]'><Button>Proceed to Audio Interview</Button></Link> : <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {(result && !result.match) || (capturedImage && referenceImage) ? (
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
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isProcessing ? "Verifying Identity..." : "Verify Identity"}
          </Button>
        </div>}

      </div>
    </div>
  )
}
