---
name: evaluator-workbench-copilot
description: >-
  Guides implementation and usage of the client-side Evaluator Workbench Copilot,
  including persistent candidate scratchpad notes, weighted composite scoring,
  verdict templates, and markdown briefing exports.
---

# Evaluator Workbench Copilot in EazyAI

The Evaluator Workbench Copilot is a client-side productivity tool designed for recruiters and hiring managers to evaluate candidate interview sessions systematically without requiring backend API calls or database storage.

---

## 1. Core Capabilities

1. **Persistent Candidate Scratchpad**:
   - Autosaves evaluator notes and thoughts to browser `localStorage` keyed by `eazyai_notes_${jobId}_${candidateEmail}`.
   - Preserves notes across page refreshes and browser restarts.
2. **Weighted Composite Score Calculator**:
   - Allows evaluators to customize category weights (e.g. Technical Depth: 40%, Keyword Match: 20%, Problem Solving: 20%, Integrity Trust: 20%).
   - Instantly calculates an aggregated overall candidate score on a 0-100 scale.
3. **Structured Verdict Templates**:
   - One-click insertion of standardized evaluation feedback templates:
     - *Strong Hire (L5/Senior Match)*
     - *Hire with Specific Skill Upskilling*
     - *Revisit / Follow-up Technical Round*
     - *No Hire (Domain / Experience Mismatch)*
     - *Flag for Integrity / Trust Review*
4. **Instant Markdown Briefing Export**:
   - Formats notes, category breakdowns, trust signals, and verdict into clean markdown copied directly to the clipboard for sharing on Slack, Teams, or email.

---

## 2. Component Architecture ([`src/components/web/evaluator-scratchpad.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/evaluator-scratchpad.tsx))

```typescript
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface EvaluatorScratchpadProps {
  jobId: string;
  candidateEmail: string;
  technicalScore?: number;
  keywordMatchRatio?: number;
  integrityTrustScore?: number;
}
```

### Storage Pattern:
```typescript
const STORAGE_KEY = `eazyai_scratchpad_${jobId}_${candidateEmail}`;

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setNotes(parsed.notes || '');
      setSelectedVerdict(parsed.verdict || '');
    } catch (e) {
      console.error('Failed to parse saved notes', e);
    }
  }
}, [jobId, candidateEmail]);

// Auto-save on change (debounced or effect-driven)
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ notes, verdict: selectedVerdict, updatedAt: new Date().toISOString() }));
}, [notes, selectedVerdict, jobId, candidateEmail]);
```

---

## 3. Integration Points

- **Candidate Audit Page**: Mounted inside [`src/routes/dashboard/interview/$id.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/interview/$id.tsx) as a persistent side panel or bottom drawer.
- **Evaluation Dialog**: Available inside [`src/components/web/evaluation-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/evaluation-dialog.tsx) to assist during official verdict submissions.
