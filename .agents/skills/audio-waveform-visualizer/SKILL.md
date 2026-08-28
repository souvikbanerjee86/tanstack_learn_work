---
name: audio-waveform-visualizer
description: >-
  Guides implementation of the HTML5 Web Audio API acoustic visualizer and advanced
  voice playback controls for candidate interview responses.
---

# Audio Waveform Visualizer & Playback Intelligence in EazyAI

The Audio Waveform Visualizer provides rich, real-time client-side acoustic playback and audio frequency inspection for candidate interview voice recordings.

---

## 1. Core Features

1. **Real-Time HTML5 Web Audio Canvas Visualizer**:
   - Uses `AudioContext` and `AnalyserNode` (`fftSize: 64` or `128`) to render dynamic frequency bars while audio plays.
   - Gracefully falls back to simulated pulsating soundwaves when audio CORS headers restrict `createMediaElementSource`.
2. **Variable Playback Speed**:
   - Quick speed toggles: `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`.
3. **Smart Skip Controls**:
   - `-5s` back and `+5s` forward buttons for easy scrubbing through complex technical answers.
4. **Interactive Seek Progress Bar**:
   - Clickable waveform and time scrubber with current timestamp and total duration.

---

## 2. Web Audio Visualizer Implementation Pattern

```typescript
import { useRef, useEffect, useState } from 'react';

export function useAudioVisualizer(audioRef: React.RefObject<HTMLAudioElement | null>, canvasRef: React.RefObject<HTMLCanvasElement | null>, isPlaying: boolean) {
  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas || !isPlaying) return;

    let animationFrameId: number;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderBars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 24;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        // Generate dynamic or frequency-driven height
        const height = Math.sin(Date.now() / 150 + i * 0.5) * 12 + 16;
        const x = i * (barWidth + 2);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#818cf8');
        gradient.addColorStop(1, '#6366f1');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 3);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderBars);
    };

    renderBars();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);
}
```

---

## 3. Integration Points

- Mounted inside [`src/components/web/audio-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/audio-outcome.tsx) to replace generic browser `<audio controls />`.
- Embedded into [`src/components/web/ai-voice-fraud-panel.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/ai-voice-fraud-panel.tsx) for acoustic inspection alongside anti-fraud score metrics.
