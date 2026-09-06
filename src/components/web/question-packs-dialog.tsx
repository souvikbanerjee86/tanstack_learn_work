import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  BookOpen,
  Briefcase,
  Check,
  CheckCheck,
  Cloud,
  Code2,
  Cpu,
  Film,
  Layers,
  Loader2,
  Radio,
  Server,
  Sparkles,
  TrendingUp,
  Users2,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  addInterviewQuestion,
  generateJobTemplatePacks,
} from '@/lib/server-function'
import { cn } from '@/lib/utils'

export interface QuestionTemplateItem {
  id: string
  question: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  competency: string
  estimatedMinutes: number
}

export interface DomainQuestionPack {
  id: string
  title: string
  category: string
  icon: typeof Code2
  badgeColor: string
  description: string
  questions: Array<QuestionTemplateItem>
}

// Universal baseline packs across disciplines
export const STANDARD_DOMAIN_PACKS: Array<DomainQuestionPack> = [
  {
    id: 'fullstack-web',
    title: 'Fullstack Web Engineer',
    category: 'Frontend & Fullstack',
    icon: Code2,
    badgeColor:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    description:
      'Modern web application architecture, SSR hydrations, client-side caching, and distributed frontend state.',
    questions: [
      {
        id: 'fs-1',
        question:
          'Explain how React 19 Server Components differ from traditional SSR hydration, and how you prevent client-side layout shifts and waterfall requests.',
        difficulty: 'Advanced',
        competency: 'Architecture & Hydration',
        estimatedMinutes: 3,
      },
      {
        id: 'fs-2',
        question:
          'Describe a strategy for implementing real-time data synchronization between multiple clients using WebSockets with optimistic UI updates and conflict resolution.',
        difficulty: 'Intermediate',
        competency: 'Real-Time Systems',
        estimatedMinutes: 3,
      },
      {
        id: 'fs-3',
        question:
          'How do you design database schema migrations in a high-traffic production application without taking any downtime or locking active tables?',
        difficulty: 'Advanced',
        competency: 'Database Transactions',
        estimatedMinutes: 4,
      },
      {
        id: 'fs-4',
        question:
          'What are the trade-offs between utilizing an edge key-value cache (such as Cloudflare KV or Redis) versus client-side TanStack React Query caching?',
        difficulty: 'Intermediate',
        competency: 'Caching & Performance',
        estimatedMinutes: 2,
      },
    ],
  },
  {
    id: 'backend-cloud',
    title: 'Backend & Cloud Systems',
    category: 'Backend Architecture',
    icon: Server,
    badgeColor:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description:
      'Distributed systems, message queues, dead-letter handling, idempotent API contracts, and Cloud Run autoscaling.',
    questions: [
      {
        id: 'be-1',
        question:
          'How do you design idempotent RESTful or gRPC API endpoints to ensure duplicate webhook dispatches or retry storms do not cause double writes?',
        difficulty: 'Intermediate',
        competency: 'API Reliability',
        estimatedMinutes: 3,
      },
      {
        id: 'be-2',
        question:
          'Explain how you would implement distributed locking across multiple microservice replicas using Redis Redlock or Postgres advisory locks, including deadlock prevention.',
        difficulty: 'Advanced',
        competency: 'Distributed Concurrency',
        estimatedMinutes: 4,
      },
      {
        id: 'be-3',
        question:
          'When designing an asynchronous event-driven pipeline with Google Cloud Pub/Sub or Kafka, how do you handle dead-letter queues, poison-pill messages, and message ordering?',
        difficulty: 'Advanced',
        competency: 'Event-Driven Messaging',
        estimatedMinutes: 4,
      },
    ],
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'Generative AI & RAG',
    icon: Cpu,
    badgeColor:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    description:
      'Retrieval-Augmented Generation (RAG), vector embeddings, hallucination prevention, and LLM orchestration.',
    questions: [
      {
        id: 'ai-1',
        question:
          'How do you optimize chunking strategies and embedding dimensions when designing a RAG vector search engine over complex, multi-page PDF documents with tables?',
        difficulty: 'Advanced',
        competency: 'RAG Architecture',
        estimatedMinutes: 4,
      },
      {
        id: 'ai-2',
        question:
          'What automated evaluation metrics and guardrail pipelines do you use to detect and prevent LLM hallucinations and prompt injection attacks in production applications?',
        difficulty: 'Advanced',
        competency: 'AI Safety & Guardrails',
        estimatedMinutes: 3,
      },
      {
        id: 'ai-3',
        question:
          'Compare the architectural trade-offs between Fine-Tuning a small open-weights model versus In-Context Learning with Few-Shot prompting against large frontier models.',
        difficulty: 'Intermediate',
        competency: 'Model Strategy',
        estimatedMinutes: 3,
      },
    ],
  },
  {
    id: 'devops-sre',
    title: 'DevOps & SRE Infrastructure',
    category: 'Cloud Infrastructure',
    icon: Layers,
    badgeColor:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description:
      'Kubernetes orchestration, canary deployment pipelines, zero-trust IAM governance, and blameless incident postmortems.',
    questions: [
      {
        id: 'ops-1',
        question:
          'Walk through how you configure Kubernetes pod resource requests, limits, horizontal pod autoscaling (HPA), and pod disruption budgets for critical microservices.',
        difficulty: 'Intermediate',
        competency: 'Kubernetes Orchestration',
        estimatedMinutes: 3,
      },
      {
        id: 'ops-2',
        question:
          'Explain how you implement zero-downtime canary deployments in a CI/CD pipeline using ArgoCD or Cloud Deploy with automated metric-based rollbacks.',
        difficulty: 'Advanced',
        competency: 'Continuous Delivery',
        estimatedMinutes: 4,
      },
      {
        id: 'ops-3',
        question:
          'During a major production outage with elevated 500 error rates, what structured steps do you take to triage, isolate the failure domain, mitigate impact, and conduct a blameless postmortem?',
        difficulty: 'Advanced',
        competency: 'Incident Response & SRE',
        estimatedMinutes: 4,
      },
    ],
  },
  {
    id: 'engineering-leadership',
    title: 'Leadership & Behavioral',
    category: 'Leadership & Strategy',
    icon: Users2,
    badgeColor:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description:
      'System design trade-off resolution, team mentorship, engineering velocity, and technical debt prioritization.',
    questions: [
      {
        id: 'lead-1',
        question:
          'Describe a situation where you had a fundamental architectural disagreement with a senior stakeholder. How did you resolve the trade-offs objectively?',
        difficulty: 'Intermediate',
        competency: 'Architectural Negotiation',
        estimatedMinutes: 3,
      },
      {
        id: 'lead-2',
        question:
          'How do you balance product pressure for immediate feature delivery against addressing critical technical debt and architectural refactoring in sprint planning?',
        difficulty: 'Intermediate',
        competency: 'Technical Roadmapping',
        estimatedMinutes: 3,
      },
      {
        id: 'lead-3',
        question:
          'How do you mentor and turn around an engineer on your team who is consistently struggling with code quality or missing release commitments?',
        difficulty: 'Intermediate',
        competency: 'People Mentorship',
        estimatedMinutes: 3,
      },
    ],
  },
]

// Intelligent Role-Tailored Question Packs Engine
function getRoleTailoredPacks(
  jobTitle?: string,
  _jobDescription?: string,
): Array<DomainQuestionPack> {
  const title = (jobTitle || '').toLowerCase()

  // 1. Node.js Developer
  if (title.includes('node') || title.includes('express') || title.includes('nest')) {
    return [
      {
        id: 'node-core',
        title: 'Node.js Core & Concurrency',
        category: 'Runtimes & Performance',
        icon: Server,
        badgeColor:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        description:
          'Event loop phases, microtask queues, libuv thread pool, and worker threads concurrency.',
        questions: [
          {
            id: 'node-1',
            question:
              'Explain the six phases of the Node.js event loop and how process.nextTick() interacts with the microtask queue compared to setImmediate().',
            difficulty: 'Advanced',
            competency: 'Event Loop & Libuv',
            estimatedMinutes: 3,
          },
          {
            id: 'node-2',
            question:
              'How do you diagnose, isolate, and fix memory leaks in a production Node.js service using V8 heap snapshots and Chrome DevTools?',
            difficulty: 'Advanced',
            competency: 'Memory Profiling',
            estimatedMinutes: 4,
          },
          {
            id: 'node-3',
            question:
              'Describe how you implement stream backpressure when reading large multi-gigabyte files from Cloud Storage and transforming them without exhausting RAM.',
            difficulty: 'Intermediate',
            competency: 'Streams & Backpressure',
            estimatedMinutes: 3,
          },
          {
            id: 'node-4',
            question:
              'When should you offload compute-heavy tasks to Node.js Worker Threads or child processes versus delegating to an external queue worker?',
            difficulty: 'Intermediate',
            competency: 'CPU Intensive Scaling',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'node-api',
        title: 'Express/NestJS API Architecture',
        category: 'REST, GraphQL & Microservices',
        icon: Code2,
        badgeColor:
          'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        description:
          'Middleware chains, dependency injection, validation pipes, and error handling filters.',
        questions: [
          {
            id: 'node-5',
            question:
              'How do you structure global exception filters, domain-level errors, and unhandled promise rejections in Express or NestJS to prevent process crashes?',
            difficulty: 'Intermediate',
            competency: 'Error Boundaries',
            estimatedMinutes: 3,
          },
          {
            id: 'node-6',
            question:
              'Walk through how you secure a Node.js REST API against prototype pollution, ReDoS (regex DoS), and cross-site scripting attacks.',
            difficulty: 'Advanced',
            competency: 'V8 Runtime Security',
            estimatedMinutes: 3,
          },
          {
            id: 'node-7',
            question:
              'How do you manage database connection pool exhaustion and transaction rollbacks using Prisma or TypeORM in a high-concurrency Node service?',
            difficulty: 'Intermediate',
            competency: 'ORM & Connection Pools',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'node-prod',
        title: 'Node.js Production & Cloud Run',
        category: 'Deployment & Monitoring',
        icon: Layers,
        badgeColor:
          'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        description:
          'Docker containerization, PM2 clustering, graceful shutdown, and Cloud Run cold-start optimization.',
        questions: [
          {
            id: 'node-8',
            question:
              'Explain how you implement graceful shutdown (SIGTERM/SIGINT) in Node.js to finish in-flight requests and close DB pools cleanly before pod termination.',
            difficulty: 'Intermediate',
            competency: 'Lifecycle Management',
            estimatedMinutes: 2,
          },
          {
            id: 'node-9',
            question:
              'What strategies do you use to reduce Docker image size and cold start latency when deploying Node.js apps to serverless Google Cloud Run?',
            difficulty: 'Intermediate',
            competency: 'Serverless Optimization',
            estimatedMinutes: 3,
          },
        ],
      },
    ]
  }

  // 2. Video Editor & Social Communication
  if (
    title.includes('video') ||
    title.includes('media') ||
    title.includes('editor') ||
    title.includes('social')
  ) {
    return [
      {
        id: 'video-craft',
        title: 'NLE Mastery & Post-Production',
        category: 'Editing & Technical Workflows',
        icon: Film,
        badgeColor:
          'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        description:
          'Premiere Pro, DaVinci Resolve, proxy rendering, multi-camera sequencing, and color management.',
        questions: [
          {
            id: 'vid-1',
            question:
              'Explain your end-to-end proxy workflow for editing 4K/6K Raw footage smoothly on team storage, from ingestion to final high-res conform.',
            difficulty: 'Intermediate',
            competency: 'Proxy Pipelines & Codecs',
            estimatedMinutes: 3,
          },
          {
            id: 'vid-2',
            question:
              'How do you color grade Log/RAW footage to conform to broadcast or web Rec.709 standards while maintaining consistent skin tones and dynamic range?',
            difficulty: 'Advanced',
            competency: 'Color Management & LUTs',
            estimatedMinutes: 4,
          },
          {
            id: 'vid-3',
            question:
              'Describe your sound design workflow: EQing dialog, loudness normalization (LUFS targeting for YouTube/IG), and music ducking.',
            difficulty: 'Intermediate',
            competency: 'Audio Post & Mastering',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'video-social',
        title: 'Hook Retention & Social Formats',
        category: 'Audience Engagement',
        icon: TrendingUp,
        badgeColor:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        description:
          'First 3-second hook retention, vertical 9:16 pacing, dynamic captions, and viral storytelling.',
        questions: [
          {
            id: 'vid-4',
            question:
              'How do you engineer the first 3 seconds of a social video (Reels/TikTok/Shorts) to maximize retention rate and prevent viewer scroll-past?',
            difficulty: 'Intermediate',
            competency: 'Hook Psychology & Pacing',
            estimatedMinutes: 3,
          },
          {
            id: 'vid-5',
            question:
              'When translating a long-form interview or keynote into 5 snackable micro-content assets, what criteria guide your selection of soundbites?',
            difficulty: 'Intermediate',
            competency: 'Narrative Extraction',
            estimatedMinutes: 3,
          },
          {
            id: 'vid-6',
            question:
              'How do you balance creative brand guidelines with high-converting visual trends (e.g., dynamic kinetic typography, fast match-cuts)?',
            difficulty: 'Advanced',
            competency: 'Brand Consistency',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'video-project',
        title: 'Revisions & Asset Management',
        category: 'Project Operations',
        icon: Briefcase,
        badgeColor:
          'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        description:
          'Frame.io stakeholder collaboration, rapid turnarounds, and archiving project media.',
        questions: [
          {
            id: 'vid-7',
            question:
              'How do you handle conflicting creative feedback from marketing stakeholders and leadership without blowing past release deadlines?',
            difficulty: 'Intermediate',
            competency: 'Stakeholder Revisions',
            estimatedMinutes: 3,
          },
        ],
      },
    ]
  }

  // 3. Azure Architect / Cloud Infrastructure
  if (
    title.includes('azure') ||
    title.includes('cloud') ||
    title.includes('architect')
  ) {
    return [
      {
        id: 'azure-arch',
        title: 'Azure Architecture & Landing Zones',
        category: 'Enterprise Cloud Design',
        icon: Cloud,
        badgeColor:
          'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        description:
          'Enterprise Scale Landing Zones, Management Groups, Hub-and-Spoke VNets, and ExpressRoute.',
        questions: [
          {
            id: 'az-1',
            question:
              'Design a secure Hub-Spoke network topology in Azure connecting on-prem via ExpressRoute with Azure Firewall, Private Endpoints, and UDRs.',
            difficulty: 'Advanced',
            competency: 'Networking & ExpressRoute',
            estimatedMinutes: 4,
          },
          {
            id: 'az-2',
            question:
              'How do you architect a multi-region active-active or active-passive disaster recovery strategy with Azure Front Door and Cosmos DB or SQL Failover Groups?',
            difficulty: 'Advanced',
            competency: 'Disaster Recovery (RTO/RPO)',
            estimatedMinutes: 4,
          },
          {
            id: 'az-3',
            question:
              'Explain how you enforce zero-trust identity and governance using Azure Entra ID (Azure AD), Privileged Identity Management (PIM), and Azure Policy.',
            difficulty: 'Intermediate',
            competency: 'Identity & Least Privilege',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'azure-finops',
        title: 'FinOps & Cost Optimization',
        category: 'Cost Governance',
        icon: TrendingUp,
        badgeColor:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        description:
          'Reserved Instances, Savings Plans, auto-shutdown VMSS, and storage tier lifecycle policies.',
        questions: [
          {
            id: 'az-4',
            question:
              'A client’s Azure bill spiked by 35% last month. What structured diagnostic process do you follow using Azure Cost Management to find and eliminate waste?',
            difficulty: 'Intermediate',
            competency: 'FinOps Diagnostic Triage',
            estimatedMinutes: 3,
          },
        ],
      },
    ]
  }

  // 4. Telecom Sales / Enterprise Sales Manager
  if (
    title.includes('sales') ||
    title.includes('telecom') ||
    title.includes('account')
  ) {
    return [
      {
        id: 'sales-b2b',
        title: 'Enterprise B2B Telecom Prospecting',
        category: 'Deal Sourcing & Solutions',
        icon: TrendingUp,
        badgeColor:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        description:
          'Selling SD-WAN, unified communications (UCaaS), MPLS, and dedicated cloud connectivity.',
        questions: [
          {
            id: 'sales-1',
            question:
              'How do you qualify an enterprise opportunity looking to migrate from legacy MPLS to managed SD-WAN and cloud voice?',
            difficulty: 'Intermediate',
            competency: 'Solution Qualification',
            estimatedMinutes: 3,
          },
          {
            id: 'sales-2',
            question:
              'Describe your playbook for navigating multi-stakeholder enterprise buying committees (CTO, CISO, VP of Infrastructure, Procurement).',
            difficulty: 'Advanced',
            competency: 'C-Suite Stakeholder Buy-in',
            estimatedMinutes: 3,
          },
          {
            id: 'sales-3',
            question:
              'When a client threatens to switch to an incumbent telecom provider offering a 20% price undercut, how do you defend margins and SLAs?',
            difficulty: 'Advanced',
            competency: 'Price Defense & Value Selling',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'sales-retention',
        title: 'Account Retention & Pipeline Management',
        category: 'Pipeline & Growth',
        icon: Briefcase,
        badgeColor:
          'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        description:
          'Quota attainment, CRM pipeline forecasting accuracy, and churn prevention.',
        questions: [
          {
            id: 'sales-4',
            question:
              'How do you manage your sales forecast in CRM to ensure predictable quota attainment with minimal slippage into next quarter?',
            difficulty: 'Intermediate',
            competency: 'Pipeline Forecasting',
            estimatedMinutes: 2,
          },
        ],
      },
    ]
  }

  // 5. Java Developer
  if (title.includes('java') || title.includes('spring')) {
    return [
      {
        id: 'java-core',
        title: 'Java Core, JVM & Concurrency',
        category: 'Runtime & Memory Internals',
        icon: Code2,
        badgeColor:
          'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
        description:
          'JVM memory model (Heap, Metaspace), G1/ZGC collectors, CompletableFuture, and virtual threads.',
        questions: [
          {
            id: 'jv-1',
            question:
              'Explain how Java Virtual Threads (Project Loom) differ from platform OS threads and their impact on throughput in blocking I/O servers.',
            difficulty: 'Advanced',
            competency: 'Virtual Threads (Loom)',
            estimatedMinutes: 3,
          },
          {
            id: 'jv-2',
            question:
              'How do you diagnose and resolve High CPU and OutOfMemoryErrors (OOM) caused by memory leaks in Java using heap dumps and JProfiler?',
            difficulty: 'Advanced',
            competency: 'JVM Troubleshooting',
            estimatedMinutes: 4,
          },
          {
            id: 'jv-3',
            question:
              'Compare the behavior and thread-safety of ConcurrentHashMap vs synchronized HashMap, focusing on striping and lock-free reads.',
            difficulty: 'Intermediate',
            competency: 'Concurrency & Locks',
            estimatedMinutes: 3,
          },
        ],
      },
      {
        id: 'java-spring',
        title: 'Spring Boot & Microservices',
        category: 'Frameworks & Architecture',
        icon: Server,
        badgeColor:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        description:
          'Spring Cloud, transaction propagation, Hibernate N+1 resolution, and Resilience4j circuit breakers.',
        questions: [
          {
            id: 'jv-4',
            question:
              'Explain how Spring @Transactional propagation attributes (REQUIRES_NEW vs REQUIRED) work and how to handle rollbacks on checked vs unchecked exceptions.',
            difficulty: 'Intermediate',
            competency: 'Transaction Propagation',
            estimatedMinutes: 3,
          },
          {
            id: 'jv-5',
            question:
              'How do you detect and solve the N+1 select problem in Spring Data JPA/Hibernate using EntityGraphs or join fetches?',
            difficulty: 'Intermediate',
            competency: 'Hibernate Query Tuning',
            estimatedMinutes: 3,
          },
        ],
      },
    ]
  }

  // 6. IoT & Embedded Systems
  if (title.includes('iot') || title.includes('embedded')) {
    return [
      {
        id: 'iot-edge',
        title: 'IoT Protocols & Edge Architecture',
        category: 'Hardware & Protocols',
        icon: Radio,
        badgeColor:
          'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
        description:
          'MQTT QoS levels, CoAP, edge computing, intermittent connectivity, and memory constraints.',
        questions: [
          {
            id: 'iot-1',
            question:
              'Compare MQTT QoS levels (0, 1, 2) regarding network overhead, latency, and duplicate message delivery over cellular IoT links.',
            difficulty: 'Intermediate',
            competency: 'MQTT Telemetry',
            estimatedMinutes: 3,
          },
          {
            id: 'iot-2',
            question:
              'How do you secure Over-The-Air (OTA) firmware updates against bricking, MITM attacks, and unauthorized rollbacks?',
            difficulty: 'Advanced',
            competency: 'Secure OTA Firmware',
            estimatedMinutes: 3,
          },
        ],
      },
    ]
  }

  // Default fallback: Custom synthesis for any arbitrary role title
  return [
    {
      id: 'role-core',
      title: `${jobTitle || 'Role'} Core Competencies`,
      category: 'Primary Technical Domain',
      icon: Code2,
      badgeColor:
        'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      description: `Core technical skills and day-to-day execution standards expected for a ${jobTitle || 'target position'}.`,
      questions: [
        {
          id: 'dyn-1',
          question: `Walk through your typical workflow when assigned a complex, high-priority deliverable as a ${jobTitle || 'specialist'}. How do you plan, execute, and validate?`,
          difficulty: 'Intermediate',
          competency: 'Execution & Standards',
          estimatedMinutes: 3,
        },
        {
          id: 'dyn-2',
          question: `What are the most challenging technical bottlenecks or edge cases you routinely encounter in your role as a ${jobTitle || 'specialist'}, and how do you resolve them?`,
          difficulty: 'Advanced',
          competency: 'Problem Solving',
          estimatedMinutes: 4,
        },
      ],
    },
    {
      id: 'role-quality',
      title: 'Production Quality & Standards',
      category: 'Operational Excellence',
      icon: Layers,
      badgeColor:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      description:
        'Quality assurance, compliance, and peer review methodologies.',
      questions: [
        {
          id: 'dyn-3',
          question: `How do you ensure zero-defect delivery, documentation accuracy, and adherence to company benchmarks in your work?`,
          difficulty: 'Intermediate',
          competency: 'Quality Assurance',
          estimatedMinutes: 3,
        },
      ],
    },
  ]
}

interface QuestionPacksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedJobId: string | null
  jobTitle?: string
  jobDescription?: string
  experience?: number
  onImportComplete?: () => void
}

export function QuestionPacksDialog({
  open,
  onOpenChange,
  selectedJobId,
  jobTitle,
  jobDescription,
  experience,
  onImportComplete,
}: QuestionPacksDialogProps) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'role' | 'standard'>('role')
  const [selectedPackId, setSelectedPackId] = useState<string>('')
  const [selectedQuestions, setSelectedQuestions] = useState<
    Record<string, boolean>
  >({})
  const [isImporting, setIsImporting] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [customAiPacks, setCustomAiPacks] = useState<
    Array<DomainQuestionPack> | null
  >(null)
  const [importProgress, setImportProgress] = useState<{
    current: number
    total: number
  } | null>(null)

  // 1. Role-tailored packs computed for this specific job requisition
  const roleTailoredPacks = useMemo(() => {
    return getRoleTailoredPacks(jobTitle, jobDescription)
  }, [jobTitle, jobDescription])

  // 2. Combined or active packs list
  const activePacksList = useMemo(() => {
    if (activeTab === 'role') {
      return customAiPacks && customAiPacks.length > 0
        ? customAiPacks
        : roleTailoredPacks
    }
    return STANDARD_DOMAIN_PACKS
  }, [activeTab, customAiPacks, roleTailoredPacks])

  // Auto-select first pack when active packs change or when dialog opens
  useEffect(() => {
    if (activePacksList.length > 0) {
      const exists = activePacksList.some((p) => p.id === selectedPackId)
      if (!exists) {
        setSelectedPackId(activePacksList[0].id)
      }
    }
  }, [activePacksList, selectedPackId])

  // Load any previously cached AI generated packs for this job
  useEffect(() => {
    if (selectedJobId) {
      try {
        const cached = localStorage.getItem(`eazyai_job_packs_${selectedJobId}`)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCustomAiPacks(
              parsed.map((p: any) => ({
                ...p,
                icon: Cpu,
                badgeColor:
                  'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
              })),
            )
          }
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [selectedJobId])

  const currentPack = useMemo(
    () =>
      activePacksList.find((p) => p.id === selectedPackId) ||
      activePacksList[0] ||
      STANDARD_DOMAIN_PACKS[0],
    [activePacksList, selectedPackId],
  )

  // Question IDs in current active pack
  const currentPackQuestionIds = useMemo(
    () => currentPack?.questions?.map((q) => q.id) || [],
    [currentPack],
  )

  const selectedInCurrentPackCount = useMemo(
    () => currentPackQuestionIds.filter((id) => selectedQuestions[id]).length,
    [currentPackQuestionIds, selectedQuestions],
  )

  const isAllSelectedInCurrent =
    currentPackQuestionIds.length > 0 &&
    selectedInCurrentPackCount === currentPackQuestionIds.length

  const toggleSelectAll = () => {
    setSelectedQuestions((prev) => {
      const next = { ...prev }
      const targetState = !isAllSelectedInCurrent
      currentPackQuestionIds.forEach((id) => {
        next[id] = targetState
      })
      return next
    })
  }

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Total selected across all packs
  const totalSelectedCount = useMemo(
    () => Object.values(selectedQuestions).filter(Boolean).length,
    [selectedQuestions],
  )

  // Trigger on-the-fly AI generation tailored to this exact JD
  const handleGenerateCustomPacks = async () => {
    if (!jobTitle) {
      toast.error('No target role title available')
      return
    }

    try {
      setIsGeneratingAI(true)
      const generated = await generateJobTemplatePacks({
        data: {
          jobTitle,
          jobDescription,
          experience: experience || 3,
        },
      })

      if (Array.isArray(generated) && generated.length > 0) {
        const formatted: Array<DomainQuestionPack> = generated.map(
          (p: any, idx: number) => ({
            id: p.id || `custom-ai-${idx}`,
            title: p.title || `Competency Pack ${idx + 1}`,
            category: p.category || 'AI Generated Domain',
            description: p.description || `Specialized evaluation criteria for ${jobTitle}`,
            icon: Sparkles,
            badgeColor:
              'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            questions: p.questions || [],
          }),
        )

        setCustomAiPacks(formatted)
        setActiveTab('role')
        if (formatted[0]) {
          setSelectedPackId(formatted[0].id)
        }

        // Cache for instant reloading next time
        if (selectedJobId) {
          localStorage.setItem(
            `eazyai_job_packs_${selectedJobId}`,
            JSON.stringify(formatted),
          )
        }

        toast.success(`Generated 4 bespoke question packs tailored to ${jobTitle}!`)
      } else {
        toast.info(
          'Using built-in tailored role packs for this job archetype.',
        )
      }
    } catch (err) {
      console.error('AI template pack generation error:', err)
      toast.error('Could not reach AI generator. Using built-in role packs.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleImport = async () => {
    if (!selectedJobId) {
      toast.error('No target requisition selected')
      return
    }

    const allPacks = [
      ...activePacksList,
      ...STANDARD_DOMAIN_PACKS,
      ...(customAiPacks || []),
    ]
    const questionsToImport: Array<string> = []

    allPacks.forEach((pack) => {
      pack.questions.forEach((q) => {
        if (selectedQuestions[q.id] && !questionsToImport.includes(q.question)) {
          questionsToImport.push(q.question)
        }
      })
    })

    if (questionsToImport.length === 0) {
      toast.error('Please select at least one question to import')
      return
    }

    setIsImporting(true)
    setImportProgress({ current: 0, total: questionsToImport.length })

    let successCount = 0
    let failedCount = 0

    for (let i = 0; i < questionsToImport.length; i++) {
      setImportProgress({ current: i + 1, total: questionsToImport.length })
      try {
        const res = await addInterviewQuestion({
          data: {
            job_id: selectedJobId,
            question: questionsToImport[i],
          },
        })
        if (res && res.question_id) {
          successCount++
        } else {
          failedCount++
        }
      } catch (err) {
        console.error('Failed to import question:', err)
        failedCount++
      }
    }

    setIsImporting(false)
    setImportProgress(null)

    if (successCount > 0) {
      toast.success(
        `Successfully imported ${successCount} template question${successCount > 1 ? 's' : ''} into ${jobTitle || 'requisition'}!`,
      )
      setSelectedQuestions({})
      // Invalidate and refetch questions for this job immediately
      await queryClient.invalidateQueries({
        queryKey: ['questions', selectedJobId],
      })
      await queryClient.refetchQueries({
        queryKey: ['questions', selectedJobId],
      })
      onImportComplete?.()
      onOpenChange(false)
    }

    if (failedCount > 0) {
      toast.error(
        `${failedCount} question${failedCount > 1 ? 's' : ''} failed to import`,
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl h-[88vh] max-h-[880px] flex flex-col p-0 gap-0 rounded-2xl md:rounded-[2.5rem] border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-6 pr-14 pb-4 border-b border-border/40 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0 shadow-xs">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-lg sm:text-2xl font-black tracking-tight text-foreground">
                    Question Bank Template Packs
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5"
                  >
                    Role Adaptive
                  </Badge>
                </div>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Dynamic, committee-ready question packs tailored specifically for{' '}
                  <strong className="text-foreground">{jobTitle || 'this requisition'}</strong>.
                </DialogDescription>
              </div>
            </div>

            {/* Header Actions: AI Generator & Role Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateCustomPacks}
                disabled={isGeneratingAI}
                className="h-9 px-3 rounded-xl border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold text-xs gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                title="Use OpenRouter AI to generate brand-new customized packs for this exact job description"
              >
                {isGeneratingAI ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-500" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5 text-purple-500" />
                )}
                <span>
                  {isGeneratingAI ? 'Synthesizing...' : 'AI Generate Tailored Packs'}
                </span>
              </Button>

              {jobTitle && (
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-xs font-bold px-3 py-1.5 bg-indigo-500/5 text-foreground border-border/60 shrink-0"
                >
                  <Briefcase className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                  {jobTitle}
                </Badge>
              )}
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
            <button
              onClick={() => setActiveTab('role')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5',
                activeTab === 'role'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-card/40 text-muted-foreground hover:text-foreground border-border/60 hover:bg-muted/40',
              )}
            >
              <Sparkles className="h-3 w-3" />
              <span>Tailored for "{jobTitle || 'Role'}"</span>
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] h-4 px-1 rounded-full',
                  activeTab === 'role'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                )}
              >
                {customAiPacks?.length || roleTailoredPacks.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab('standard')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5',
                activeTab === 'standard'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-card/40 text-muted-foreground hover:text-foreground border-border/60 hover:bg-muted/40',
              )}
            >
              <span>All Standard Domains</span>
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] h-4 px-1 rounded-full',
                  activeTab === 'standard'
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {STANDARD_DOMAIN_PACKS.length}
              </Badge>
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body: Two Column (Domain List & Questions) */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* Domain Category Selector (Left column) */}
          <div className="w-full md:w-80 lg:w-84 border-b md:border-b-0 md:border-r border-border/40 bg-muted/10 p-3 sm:p-4 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-2">
            <div className="hidden md:block px-2 py-1 text-[11px] font-black uppercase tracking-wider text-muted-foreground/80">
              {activeTab === 'role'
                ? `Role Packs (${activePacksList.length})`
                : `General Packs (${activePacksList.length})`}
            </div>

            {activePacksList.map((pack) => {
              const Icon = pack.icon
              const isSelected = pack.id === selectedPackId
              const selectedInPack = pack.questions.filter(
                (q) => selectedQuestions[q.id],
              ).length

              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  className={cn(
                    'w-auto md:w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 shrink-0 cursor-pointer border active:scale-[0.99]',
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25'
                      : 'bg-card/40 hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border/60 hover:border-border',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                      )}
                    >
                      <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    </div>
                    <div className="min-w-0 pr-1">
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {pack.title}
                      </div>
                      <div
                        className={cn(
                          'text-[11px] hidden md:block truncate mt-0.5',
                          isSelected
                            ? 'text-indigo-100 font-medium'
                            : 'text-muted-foreground',
                        )}
                      >
                        {pack.questions.length} questions • {pack.category}
                      </div>
                    </div>
                  </div>

                  {selectedInPack > 0 && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-[10px] font-black h-5 px-2 rounded-full shrink-0 ml-1.5',
                        isSelected
                          ? 'bg-white text-indigo-700 font-extrabold'
                          : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-extrabold',
                      )}
                    >
                      {selectedInPack}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>

          {/* Questions Preview & Selection Area */}
          <div className="flex-1 min-h-0 flex flex-col bg-background/50">
            {/* Domain Overview Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                    {currentPack.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5',
                      currentPack.badgeColor,
                    )}
                  >
                    {currentPack.category}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {currentPack.description}
                </p>
              </div>

              {/* Select All Toggle */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="h-8.5 px-3 text-xs font-bold rounded-xl border-border/60 hover:bg-muted/80 cursor-pointer shadow-xs"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                  <span>
                    {isAllSelectedInCurrent
                      ? 'Deselect Pack'
                      : 'Select All In Pack'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Questions List */}
            <ScrollArea className="flex-1 p-4 sm:p-6">
              <div className="space-y-3.5 max-w-4xl">
                {currentPack.questions.map((item, idx) => {
                  const isChecked = Boolean(selectedQuestions[item.id])

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleQuestion(item.id)}
                      className={cn(
                        'p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer group select-none',
                        isChecked
                          ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/20'
                          : 'bg-card/40 hover:bg-muted/40 border-border/60 hover:border-border/80 shadow-xs',
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleQuestion(item.id)}
                          className="mt-1 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-md h-4.5 w-4.5"
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                              Question {idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold px-2 py-0.5 border-border/60 bg-muted/30"
                              >
                                {item.competency}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] font-black uppercase tracking-wider px-2 py-0.5',
                                  item.difficulty === 'Advanced'
                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                    : item.difficulty === 'Intermediate'
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                                )}
                              >
                                {item.difficulty}
                              </Badge>
                              <span className="text-[11px] text-muted-foreground font-mono font-medium">
                                ~{item.estimatedMinutes} mins
                              </span>
                            </div>
                          </div>

                          <p className="text-sm sm:text-[15px] text-foreground font-semibold leading-relaxed">
                            {item.question}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 sm:p-5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground self-start sm:self-center font-medium">
            <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
            <span>
              {totalSelectedCount > 0 ? (
                <strong className="text-foreground font-bold">
                  {totalSelectedCount} question{totalSelectedCount > 1 ? 's' : ''}{' '}
                  selected for {jobTitle || 'requisition'}
                </strong>
              ) : (
                'Select questions to import into this requisition'
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
              className="w-1/2 sm:w-auto h-10 rounded-xl text-xs font-bold border-border/60 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={totalSelectedCount === 0 || isImporting}
              className="w-1/2 sm:w-auto h-10 rounded-xl px-5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 cursor-pointer transition-all active:scale-95"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  <span>
                    Importing {importProgress?.current} of{' '}
                    {importProgress?.total}...
                  </span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  <span>Import {totalSelectedCount} Questions</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
