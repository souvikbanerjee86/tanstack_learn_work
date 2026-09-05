import React from 'react'
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Rect,
  Circle,
  G,
  Line,
} from '@react-pdf/renderer'
import path from 'node:path'

// High-end Executive Palette (Indigo, Violet, Midnight Slate, Emerald, Amber, Cool Grey)
const palette = {
  primary: '#4f46e5', // Royal Indigo
  primaryDark: '#3730a3', // Deep Indigo
  primaryLight: '#eef2ff', // Indigo Tint
  primaryBorder: '#c7d2fe', // Light Indigo Border
  accentViolet: '#7c3aed', // Vivid Violet
  violetLight: '#f5f3ff', // Violet Tint
  slate900: '#0f172a', // Midnight Dark
  slate800: '#1e293b', // Deep Slate
  slate700: '#334155', // Header Slate
  slate600: '#475569', // Body Text Slate
  slate500: '#64748b', // Muted Label Slate
  slate400: '#94a3b8', // Subtitle Muted Slate
  slate200: '#e2e8f0', // Surface Border
  slate100: '#f1f5f9', // Subtle Background
  slate50: '#f8fafc', // Page Light Tint
  emerald: '#059669', // Success Green
  emeraldLight: '#ecfdf5', // Green Tint
  emeraldBorder: '#a7f3d0', // Green Border
  amber: '#d97706', // Warning Gold
  amberLight: '#fffbeb', // Amber Tint
  amberBorder: '#fde68a', // Amber Border
  rose: '#e11d48', // Alert Red
  roseLight: '#fff1f2', // Red Tint
  roseBorder: '#fecdd3', // Red Border
  white: '#ffffff',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 36,
    backgroundColor: palette.white,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: palette.slate700,
    lineHeight: 1.4,
  },

  // Running Header
  runningHeader: {
    position: 'absolute',
    top: 16,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.slate200,
    paddingBottom: 6,
  },
  runningHeaderTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: palette.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  runningHeaderSub: {
    fontSize: 7,
    color: palette.slate400,
  },

  // Running Footer
  runningFooter: {
    position: 'absolute',
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.slate200,
    paddingTop: 6,
  },
  runningFooterText: {
    fontSize: 7,
    color: palette.slate400,
  },
  pageNumber: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate500,
  },

  // Cover Hero Banner
  coverHeroBanner: {
    backgroundColor: palette.slate900,
    borderRadius: 8,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: palette.primary,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(165, 180, 252, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
  },
  brandPillText: {
    color: '#a5b4fc',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.white,
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
    lineHeight: 1.25,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 8.5,
    lineHeight: 1.35,
    marginBottom: 10,
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'column',
  },
  metaLabel: {
    fontSize: 6.2,
    color: palette.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
    fontFamily: 'Helvetica-Bold',
  },
  metaValue: {
    fontSize: 7.2,
    color: palette.white,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    gap: 6,
  },
  sectionTag: {
    backgroundColor: palette.primaryLight,
    borderWidth: 1,
    borderColor: palette.primaryBorder,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: palette.primaryDark,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate900,
    letterSpacing: 0.3,
  },
  sectionDesc: {
    fontSize: 8.5,
    color: palette.slate600,
    marginBottom: 8,
    lineHeight: 1.35,
  },

  // Cards and Grids
  cardGrid2: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  cardGrid3: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: palette.slate50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.slate200,
    padding: 10,
  },
  cardAccentPrimary: {
    borderLeftWidth: 3,
    borderLeftColor: palette.primary,
  },
  cardAccentViolet: {
    borderLeftWidth: 3,
    borderLeftColor: palette.accentViolet,
  },
  cardAccentEmerald: {
    borderLeftWidth: 3,
    borderLeftColor: palette.emerald,
  },
  cardAccentAmber: {
    borderLeftWidth: 3,
    borderLeftColor: palette.amber,
  },
  cardTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate900,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 7.8,
    color: palette.slate600,
    lineHeight: 1.35,
  },

  // Architecture Flow Diagram Box
  diagramContainer: {
    backgroundColor: palette.slate900,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.slate800,
  },
  diagramTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  diagramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  diagramNode: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 6,
    alignItems: 'center',
  },
  diagramNodeTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: palette.white,
    marginBottom: 2,
    textAlign: 'center',
  },
  diagramNodeSubtitle: {
    fontSize: 6.5,
    color: '#94a3b8',
    textAlign: 'center',
  },
  diagramArrow: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#6366f1',
  },

  // Tables
  table: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.slate200,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tableHeader: {
    backgroundColor: palette.slate100,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.slate200,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4.5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.slate200,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: palette.white,
  },
  tableRowOdd: {
    backgroundColor: palette.slate50,
  },
  tableCell: {
    fontSize: 7.5,
    color: palette.slate700,
  },
  tableCellBold: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate900,
  },

  // Badges & Pills
  badgeEmerald: {
    backgroundColor: palette.emeraldLight,
    borderWidth: 1,
    borderColor: palette.emeraldBorder,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    color: palette.emerald,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  badgeAmber: {
    backgroundColor: palette.amberLight,
    borderWidth: 1,
    borderColor: palette.amberBorder,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    color: palette.amber,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  badgeIndigo: {
    backgroundColor: palette.primaryLight,
    borderWidth: 1,
    borderColor: palette.primaryBorder,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    color: palette.primaryDark,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },

  // Callout Box
  calloutBox: {
    backgroundColor: palette.primaryLight,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.primaryBorder,
    padding: 9,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  calloutText: {
    flex: 1,
    fontSize: 7.8,
    color: palette.primaryDark,
    lineHeight: 1.35,
  },

  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: palette.primary,
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 7.8,
    color: palette.slate600,
    lineHeight: 1.35,
  },
})

// Main PDF Document Component
export const EazyAiPlatformReport = () => (
  <Document
    title="EazyAI Platform Architecture and Technical Specification"
    author="EazyAI Engineering Team"
    subject="Enterprise Talent Intelligence & Multimodal AI Interview Automation"
    keywords="TanStack Start, BFF, Google Cloud Run, Dialogflow CX, Vector RAG, Anti-Fraud"
  >
    {/* ========================================================================= */}
    {/* PAGE 1: COVER & EXECUTIVE OVERVIEW                                        */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      {/* Running Header */}
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Architecture, Security & Feature Matrix
        </Text>
      </View>

      {/* Cover Hero */}
      <View style={styles.coverHeroBanner}>
        <View style={styles.brandRow}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Helvetica-Bold',
              color: '#818cf8',
              letterSpacing: 1.5,
            }}
          >
            EAZYAI INTELLIGENCE
          </Text>
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>Enterprise Whitepaper</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>
          Autonomous Talent Intelligence & Multimodal AI Interviewing
        </Text>
        <Text style={styles.heroSubtitle}>
          Complete technical architecture, zero-trust security specifications,
          distributed microservices catalog, proctored anti-fraud engine, and
          glassmorphic design system implementation.
        </Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Framework Core</Text>
            <Text style={styles.metaValue}>TanStack Start + React 19</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Runtime & Cloud</Text>
            <Text style={styles.metaValue}>Nitro ESM & Google Cloud Run</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Security Model</Text>
            <Text style={styles.metaValue}>
              IAM Zero-Trust + HttpOnly Cookie
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Classification</Text>
            <Text style={styles.metaValue}>Public Technical Specification</Text>
          </View>
        </View>
      </View>

      {/* Executive Summary */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Executive Brief</Text>
        <Text style={styles.sectionTitle}>
          1. Platform Overview & Problem Statement
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        Modern enterprise recruitment faces severe bottlenecks: high manual
        screening overhead, vulnerability to synthetic resumes, impersonation
        during remote assessments, and lack of calibrated technical rubrics.
        EazyAI solves this through an end-to-end autonomous recruiting mesh
        combining semantic vector search, conversational AI agents, multimodal
        evaluation, and real-time biometric anti-fraud proctoring.
      </Text>

      {/* 3 Pillar Cards */}
      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>1. Vector RAG Matching</Text>
          <Text style={styles.cardText}>
            Automated resume parsing and semantic cosine similarity scoring
            across candidate archives with explicit gap analysis and seniority
            deduction.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>2. Multimodal AI Interviews</Text>
          <Text style={styles.cardText}>
            Autonomous spoken technical interviews conducted via Dialogflow CX,
            featuring real-time speech-to-text, acoustic waveform inspection,
            and domain rubric scoring.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>3. Anti-Fraud Proctoring</Text>
          <Text style={styles.cardText}>
            Synthetic voice deepfake detection, computer vision webcam face
            verification, and proctored movement anomaly tracking combined into
            a unified Trust Gauge.
          </Text>
        </View>
      </View>

      {/* Document Contents Table */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Index</Text>
        <Text style={styles.sectionTitle}>Document Structure</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>
            Section
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '45%' }]}>Topic</Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Core Architectural Focus
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '15%' }]}>
            Section 2
          </Text>
          <Text style={[styles.tableCell, { width: '45%' }]}>
            System Architecture & Security Model
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            BFF Pattern, Nitro, Google Cloud IAM & OIDC
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '15%' }]}>
            Section 3
          </Text>
          <Text style={[styles.tableCell, { width: '45%' }]}>
            Microservices Ecosystem & API Registry
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            20+ Cloud Run Endpoints, Dialogflow CX & OpenRouter
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '15%' }]}>
            Section 4
          </Text>
          <Text style={[styles.tableCell, { width: '45%' }]}>
            Candidate Ingestion, RAG Discovery & Questions
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Storage Explorer, Vector Corpus & Sandbox Simulator
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '15%' }]}>
            Section 5
          </Text>
          <Text style={[styles.tableCell, { width: '45%' }]}>
            Multimodal Intelligence & Anti-Fraud Engine
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Deepfake Voice Analysis, Gaze Proctoring, Trust Gauge
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '15%' }]}>
            Section 6
          </Text>
          <Text style={[styles.tableCell, { width: '45%' }]}>
            Evaluator Workbench, Email Sync & Admin
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Scratchpad, PDF Dossiers, Inbound Mail & RBAC
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '15%' }]}>
            Section 7
          </Text>
          <Text style={[styles.tableCell, { width: '45%' }]}>
            Glassmorphism Design & Engineering Guide
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            OKLCH Palette, Tailwind v4, Vitest & Docker Deployment
          </Text>
        </View>
      </View>

      {/* Running Footer */}
      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* ========================================================================= */}
    {/* PAGE 2: SYSTEM ARCHITECTURE & SECURITY PATTERNS                           */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          System Architecture & Security Model
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Architecture</Text>
        <Text style={styles.sectionTitle}>
          2. Backend-For-Frontend (BFF) & Zero-Trust Security
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI adheres to strict separation of concerns. Browser clients never
        communicate directly with downstream microservices. The TanStack Start
        server layer executes within the Nitro engine, serving as the sole
        trusted orchestrator that authenticates requests, enforces role-based
        access, and securely proxies payloads to Google Cloud Run.
      </Text>

      {/* Structural Dataflow Diagram */}
      <View style={styles.diagramContainer}>
        <Text style={styles.diagramTitle}>
          Data Flow & Identity Verification Topology
        </Text>
        <View style={styles.diagramRow}>
          <View style={styles.diagramNode}>
            <Text style={styles.diagramNodeTitle}>Browser Client</Text>
            <Text style={styles.diagramNodeSubtitle}>
              TanStack Router & Query
            </Text>
            <Text style={{ fontSize: 6, color: '#a5b4fc', marginTop: 2 }}>
              HttpOnly Session Cookie
            </Text>
          </View>
          <Text style={styles.diagramArrow}>➔</Text>
          <View style={[styles.diagramNode, { borderColor: '#818cf8' }]}>
            <Text style={styles.diagramNodeTitle}>
              BFF Layer (Start / Nitro)
            </Text>
            <Text style={styles.diagramNodeSubtitle}>isLoginMiddleware</Text>
            <Text style={{ fontSize: 6, color: '#38bdf8', marginTop: 2 }}>
              Firebase Admin Claims Check
            </Text>
          </View>
          <Text style={styles.diagramArrow}>➔</Text>
          <View style={[styles.diagramNode, { borderColor: '#c084fc' }]}>
            <Text style={styles.diagramNodeTitle}>Google IAM OIDC Minter</Text>
            <Text style={styles.diagramNodeSubtitle}>google-auth-library</Text>
            <Text style={{ fontSize: 6, color: '#e879f9', marginTop: 2 }}>
              Mint ID Token for Target Service
            </Text>
          </View>
          <Text style={styles.diagramArrow}>➔</Text>
          <View style={styles.diagramNode}>
            <Text style={styles.diagramNodeTitle}>Cloud Run Mesh</Text>
            <Text style={styles.diagramNodeSubtitle}>
              20+ Private Microservices
            </Text>
            <Text style={{ fontSize: 6, color: '#4ade80', marginTop: 2 }}>
              Zero-Trust Authenticated
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Client-to-BFF Session Lifecycle</Text>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Firebase Client Authentication:
              </Text>{' '}
              User authenticates via email/password or SSO, acquiring a
              short-lived ID token.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Session Cookie Exchange:
              </Text>{' '}
              The BFF converts the ID token into a 5-day secure session cookie
              via{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                adminAuth.createSessionCookie()
              </Text>
              .
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Strict Cookie Directives:
              </Text>{' '}
              Employs{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                HttpOnly: true
              </Text>
              ,{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                SameSite: 'lax'
              </Text>
              , and{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                Secure: true
              </Text>{' '}
              in production, preventing XSS token harvesting.
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            BFF-to-Microservice Zero-Trust Auth
          </Text>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                OIDC Token Minting:
              </Text>{' '}
              Downstream Cloud Run services reject unauthenticated traffic with
              HTTP 403. The BFF generates an OpenID Connect token using
              Application Default Credentials (ADC).
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Audience Scoping:
              </Text>{' '}
              Every ID token is audience-bound to the exact base URL of the
              target microservice, preventing cross-service replay attacks.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Automated Header Injection:
              </Text>{' '}
              The{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                GoogleAuth
              </Text>{' '}
              client injects the token into outbound{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                Authorization: Bearer
              </Text>{' '}
              headers.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>State & Caching</Text>
        <Text style={styles.sectionTitle}>
          Client Caching & SSR Prefetching Strategy
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        To achieve instantaneous route transitions without visual layout shifts,
        EazyAI pairs TanStack Router route loaders with TanStack React Query v5
        server-state synchronization:
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Data Domain
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '28%' }]}>
            SSR Loader Mechanism
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Client staleTime / gcTime
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Invalidation Trigger
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Job Requisitions
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            context.queryClient.ensureQueryData
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            staleTime: 60s, gcTime: 5m
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Job creation, edits, status toggles
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Candidate Archive
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            context.queryClient.prefetchQuery
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            staleTime: 30s, gcTime: 5m
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Batch CV upload, manual insertion
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Interview Outcomes
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Dynamic loader query fetch
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            staleTime: 15s, gcTime: 2m
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Recruiter evaluation submission
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            User Roles & Claims
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            beforeLoad root dashboard guard
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Infinity (session-bound)
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Admin role modification event
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* ========================================================================= */}
    {/* PAGE 3: MICROSERVICES ECOSYSTEM & DOWNSTREAM INTEGRATIONS                 */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Microservices Ecosystem & API Registry
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Integration Mesh</Text>
        <Text style={styles.sectionTitle}>
          3. Microservices Topology & External AI Gateways
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        All downstream communication is bound through the centralized registry
        in{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>
          src/lib/api-path.ts
        </Text>
        . The platform orchestrates 20+ specialized Google Cloud Run containers
        deployed across{' '}
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>us-central1</Text> and{' '}
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>europe-west1</Text>.
      </Text>

      {/* Microservice Taxonomy Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '28%' }]}>
            Domain / Service Key
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Region</Text>
          <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Method</Text>
          <Text style={[styles.tableHeaderCell, { width: '48%' }]}>
            Functional Responsibility
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            BUCKET_LIST_API
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>GET</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Inspects GCS storage prefixes for resume PDFs and media assets.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            RAG_SEARCH_API
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>POST</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Executes semantic vector searches over parsed resumes against job
            criteria.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            TRIGGER_INDEX
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>POST</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Triggers asynchronous re-indexing into Corpus 1939767209815441408.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            JOB_DETAILS / ADD / EDIT
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>CRUD</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Requisition lifecycle management, date windows, multi-location
            arrays.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            ADD_MULTIPLE_CANDIDATES
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>POST</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            High-throughput batch resume ingestion using multipart/form-data.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            QUESTION_ADD_AI
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>POST</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            AI generator synthesizing technical and behavioral interview
            questions.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            SPEECH_TO_TEXT
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>POST</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Transcribes spoken candidate audio answers with timing markers.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            VOICE_FRAUD_DETECTION
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>GET</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Detects synthetic voice cloning, audio artifacts, and deepfake
            speech.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            FACE_DETECTION
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>POST</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Compares webcam capture against resume photo to prevent
            impersonation.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            MOVEMENT_OUTCOME
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>GET</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Monitors candidate tab switching, gaze deviations, and head
            orientations.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '28%' }]}>
            INTERVIEW_VIDEO_API
          </Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '12%' }]}>GET</Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Streams candidate interview video recordings directly from Google
            Cloud Storage.
          </Text>
        </View>
      </View>

      {/* External AI Integrations */}
      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Google Cloud Dialogflow CX Integration
          </Text>
          <Text style={styles.cardText}>
            EazyAI integrates natively with the Dialogflow CX runtime via{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              @google-cloud/dialogflow-cx
            </Text>
            . The conversational agent manages stateful interview dialog,
            transitions through technical assessment nodes, and logs real-time
            token metrics (Prompt, Candidate, Audio, and Text tokens) visible in
            the session timeline.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>OpenRouter LLM Synthesis Gateway</Text>
          <Text style={styles.cardText}>
            The platform leverages{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              @openrouter/sdk
            </Text>{' '}
            to invoke state-of-the-art models such as{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              nvidia/nemotron-3-super-120b-a12b:free
            </Text>
            . Recruiters input minimal parameters (Title, Experience, Skills) to
            generate calibrated job descriptions and rubric standards.
          </Text>
        </View>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutText}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>
            Downstream Microservice Registration Principle:{' '}
          </Text>
          All new services must be registered in{' '}
          <Text style={{ fontFamily: 'Helvetica-Oblique' }}>API_PATH</Text>,
          have typed interfaces in{' '}
          <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
            src/lib/types.ts
          </Text>
          , and be wrapped in a{' '}
          <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
            createServerFn
          </Text>{' '}
          with{' '}
          <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
            isLoginMiddleware
          </Text>{' '}
          to ensure uniform error handling, telemetry, and zero-trust
          authentication.
        </Text>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* ========================================================================= */}
    {/* PAGE 4: CANDIDATE INGESTION, RAG DISCOVERY & QUESTION SIMULATOR           */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Candidate Ingestion, RAG Matching & Questions
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Ingestion & Discovery</Text>
        <Text style={styles.sectionTitle}>
          4. Resume Ingestion, Vector Archive & RAG Matching
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI combines cloud-native object storage with high-dimensional vector
        embeddings to automate candidate sourcing, eliminating reliance on
        keyword filters in favor of deep semantic qualifications matching.
      </Text>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Archive Bank & Cloud Storage Explorer
          </Text>
          <Text style={styles.cardText}>
            The Archive Bank (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              /dashboard/import
            </Text>
            ) provides a virtual file system inspecting Google Cloud Storage.
            Recruiters can view folder hierarchies, review MIME metadata,
            download signed URLs, and select specific document subsets to
            trigger asynchronous vector re-indexing into Corpus{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              1939767209815441408
            </Text>
            .
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Batch High-Throughput CV Ingestion
          </Text>
          <Text style={styles.cardText}>
            The Batch Ingestion modal (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              add-multiple-candidates-dialog.tsx
            </Text>
            ) supports drag-and-drop batch upload of dozens of resumes
            concurrently. The BFF streams files via{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              multipart/form-data
            </Text>{' '}
            to the ingestion microservice, parsing candidate names, emails, and
            contact records with zero UI blocking.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Semantic Search</Text>
        <Text style={styles.sectionTitle}>
          Vector RAG Discovery Architecture
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        The AI Discovery engine (
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
          /dashboard/discover
        </Text>
        ) allows recruiters to articulate nuanced hiring criteria through a
        structured form validated via{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>
          profileSearchSchema
        </Text>
        :
      </Text>

      {/* RAG Search Step Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>
            Evaluation Dimension
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Processing & Vector Mechanics
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Recruiter Actionable Output
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            Match Score (0-100%)
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Cosine similarity between requisition embedding and resume text
            chunk vectors.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Color-coded match badge for instant top-tier candidate ranking.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            Seniority Inference
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Heuristic deduction across total experience, team leadership
            indicators, and roles.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Categorized as Junior, Mid, Senior, or Lead architect level.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            Matched Criteria
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Vector projection highlights matching skills, libraries, and
            certifications.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            List of explicitly satisfied job requirements with source
            references.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            Missing Information
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Negative constraint analysis identifying requisition requirements
            omitted in CV.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Flags skill gaps for probing during live automated interviews.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Question Sandbox</Text>
        <Text style={styles.sectionTitle}>
          AI Question Bank & Candidate Experience Simulator
        </Text>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Calibrated Question Bank</Text>
          <Text style={styles.cardText}>
            Recruiters can manually curate or synthesize interview questions per
            requisition. The AI Question Generator (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              QUESTION_ADD_AI
            </Text>
            ) constructs questions balanced across domain technical knowledge,
            system architecture, and behavioral leadership rubrics.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentAmber]}>
          <Text style={styles.cardTitle}>Interactive Candidate Simulator</Text>
          <Text style={styles.cardText}>
            The Question Simulator (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              question-simulator-dialog.tsx
            </Text>
            ) allows hiring teams to experience the interview from the applicant
            perspective. It emulates question pacing, speech input, countdown
            timers, and simulated audio response transcription before questions
            are deployed live.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* ========================================================================= */}
    {/* PAGE 5: MULTIMODAL INTERVIEW EVALUATION & ANTI-FRAUD ENGINE               */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Multimodal Intelligence & Anti-Fraud Suite
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Multimodal AI</Text>
        <Text style={styles.sectionTitle}>
          5. Automated Interview Evaluation & Biometric Anti-Fraud
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        Remote recruitment is increasingly vulnerable to AI-assisted cheating,
        proxy test takers, and synthetic speech cloning. EazyAI combines
        acoustic waveform forensics, biometric face verification, and proctoring
        telemetry into an impregnable trust layer.
      </Text>

      {/* Trust Gauge & Anti-Fraud Grid */}
      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Face Anti-Impersonation</Text>
          <Text style={styles.cardText}>
            Compares webcam captures taken during the interview against
            candidate resume photos using neural face embeddings (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              FACE_DETECTION
            </Text>
            ). Prevents proxy candidate substitutions.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Voice Deepfake Detection</Text>
          <Text style={styles.cardText}>
            The Audio Analysis engine (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              VOICE_FRAUD_DETECTION
            </Text>
            ) inspects acoustic spectral flux, cloning jitter, and synthetic
            artifacts, classifying recordings as{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Human</Text>,{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>Suspicious</Text>, or{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>AI-Generated</Text>.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentAmber]}>
          <Text style={styles.cardTitle}>Movement & Gaze Proctoring</Text>
          <Text style={styles.cardText}>
            Telemetry tracking logs browser tab switches, background application
            focus changes, out-of-frame head deviations, and erratic gaze shifts
            during active questioning (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              MOVEMENT_OUTCOME
            </Text>
            ).
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Audio & Video</Text>
        <Text style={styles.sectionTitle}>
          Acoustic Waveform Analysis & Video Stream Review
        </Text>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            HTML5 Web Audio API Waveform Player
          </Text>
          <Text style={styles.cardText}>
            The acoustic player (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              audio-waveform-player.tsx
            </Text>
            ) creates an in-browser
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              {' '}
              AudioContext
            </Text>{' '}
            with real-time frequency-domain and time-domain visualizers.
            Evaluators can scrub audio, modulate playback rates (0.75x to 2.0x),
            and inspect acoustic anomalies during candidate responses.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Candidate Video Streaming & Outcome Preview
          </Text>
          <Text style={styles.cardText}>
            The Video Outcome suite (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              video-outcome.tsx
            </Text>
            ) streams interview video recordings stored in Google Cloud Storage
            via authenticated signed URLs. Displays duration, file size,
            timestamps, and playback controls directly aligned with candidate
            transcripts.
          </Text>
        </View>
      </View>

      {/* Trust Gauge Scoring Algorithm Table */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Trust Scoring</Text>
        <Text style={styles.sectionTitle}>
          Composite Integrity Trust Gauge Architecture
        </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Biometric Telemetry
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>
            Weight Contribution
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Verification Threshold
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '30%' }]}>
            Penalty Trigger
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Face Verification
          </Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>
            35% Total Weight
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            {'Cosine Match > 0.82'}
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            Impersonation flag, unknown attendee
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Acoustic Authenticity
          </Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>
            35% Total Weight
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            {'Human Confidence > 85%'}
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            Synthetic speech / Voice cloning detected
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Movement & Tab Switches
          </Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>
            30% Total Weight
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            {'< 3 Focus Changes'}
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            Continuous gaze off-screen, tab switching
          </Text>
        </View>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutText}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>
            Session Timeline Transparency:{' '}
          </Text>
          The Session Timeline (
          <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
            session-timeline.tsx
          </Text>
          ) reconstructs the complete Dialogflow CX conversational journey.
          Hiring teams can review every turn, tool invocation arguments,
          candidate thought signatures, and exact token counts.
        </Text>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* ========================================================================= */}
    {/* PAGE 6: EVALUATOR WORKBENCH, REPORTING & ADMINISTRATION                   */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Evaluator Workbench, Reporting & Admin
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Evaluator Copilot</Text>
        <Text style={styles.sectionTitle}>
          6. Evaluator Workbench Copilot & Executive Dossiers
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI provides a client-side copilot environment empowering recruitment
        teams to conduct rigorous, synchronized evaluations with real-time
        composite scoring and client-rendered executive PDF generation.
      </Text>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Evaluator Scratchpad Copilot</Text>
          <Text style={styles.cardText}>
            The Scratchpad (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              evaluator-scratchpad.tsx
            </Text>
            ) automatically persists evaluator notes in{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>localStorage</Text>{' '}
            keyed by candidate and job ID. Includes weighted scoring sliders
            (Technical Competency, Communication, Cultural Fit) and one-click
            verdict templates ("Strong Hire", "Solid Contender", "Reject -
            Technical Gap", "Reject - Integrity Flag").
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Client-Side Executive Dossier Generation
          </Text>
          <Text style={styles.cardText}>
            Powered by{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              @react-pdf/renderer
            </Text>
            , the platform dynamically renders multi-page PDF candidate
            evaluation dossiers without requiring backend headless browsers.
            Dossiers encapsulate candidate demographics, Trust Gauge biometric
            scores, question breakdowns, and evaluator signatures.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Enterprise Governance</Text>
        <Text style={styles.sectionTitle}>
          Inbound Email Sync, RBAC & Site Configuration
        </Text>
      </View>

      {/* 3 Admin Cards */}
      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Inbound Email Sync</Text>
          <Text style={styles.cardText}>
            Synchronizes with recruitment mailboxes (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>EMAIL_SYNC</Text>
            ), parsing applicant resumes, extracting candidate email bodies, and
            auto-associating candidates with active job IDs.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentAmber]}>
          <Text style={styles.cardTitle}>Role-Based Access Control</Text>
          <Text style={styles.cardText}>
            Admin Management (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              /dashboard/admin-user
            </Text>
            ) supports granular roles: Super Admin, Recruiter, Interviewer, and
            Viewer. Includes account restriction toggles and access audit logs.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Global Interview Config</Text>
          <Text style={styles.cardText}>
            Configuration console (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              /dashboard/config
            </Text>
            ) controls interview duration quotas, candidate invitation link
            expiration windows (e.g. 48 hours), and question count limits.
          </Text>
        </View>
      </View>

      {/* Navigation Tools Table */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Productivity</Text>
        <Text style={styles.sectionTitle}>
          Command Palette (⌘K) & Guided Onboarding Tour
        </Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Productivity Feature
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Component Implementation
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '50%' }]}>
            User Workflow Advantage
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Global Search (⌘K / Ctrl+K)
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            global-search-dialog.tsx
          </Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>
            Instant keyboard navigation across jobs, candidate files, routes,
            and admin tools.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Interactive Tour
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            onboarding-tour-dialog.tsx
          </Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>
            Interactive multi-step modal tour welcoming new recruiters, stored
            in localStorage.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            India Requisition Map
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            facility-map-dialog.tsx
          </Text>
          <Text style={[styles.tableCell, { width: '50%' }]}>
            Interactive SVG visualization of job distribution across all 28
            states and union territories.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>

    {/* ========================================================================= */}
    {/* PAGE 7: DESIGN SYSTEM (GLASSMORPHISM) & ENGINEERING GUIDE                 */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Design System & Engineering Guidelines
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Design System</Text>
        <Text style={styles.sectionTitle}>
          7. Frosted Glassmorphism Design System (OKLCH)
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI is designed to deliver a visually captivating, depth-rich user
        experience. Built with{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Tailwind CSS v4</Text>,
        the interface utilizes the{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>OKLCH</Text> color space
        for superior perceptual contrast and vibrancy when interacting with
        semi-transparent frosted glass layers.
      </Text>

      {/* Glassmorphism Specs Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Design Token Class
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '30%' }]}>
            Tailwind v4 Styling Rule
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '23%' }]}>
            OKLCH Light / Dark
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            UI Placement Role
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            glass-header
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            bg-background/50, backdrop-blur-2xl
          </Text>
          <Text style={[styles.tableCell, { width: '23%' }]}>
            Light: 50% / Dark: 70%
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Sticky top navigation bar
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            glass-sidebar
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            bg-sidebar/40, backdrop-blur-2xl
          </Text>
          <Text style={[styles.tableCell, { width: '23%' }]}>
            Light: 40% / Dark: 40%
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Primary app navigation panel
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            glass-card
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            bg-card/30, backdrop-blur-lg, shadow-lg
          </Text>
          <Text style={[styles.tableCell, { width: '23%' }]}>
            Light: 30% / Dark: 30%
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Metric widgets, data tables, dialogs
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            ambient-pulse
          </Text>
          <Text style={[styles.tableCell, { width: '30%' }]}>
            15s breathing pulse keyframe
          </Text>
          <Text style={[styles.tableCell, { width: '23%' }]}>
            Indigo / Violet glow
          </Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>
            Dual corner ambient background
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Typography</Text>
        <Text style={styles.sectionTitle}>Typography Hierarchy</Text>
      </View>
      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Outfit Variable</Text>
          <Text style={styles.cardText}>
            Used for page heroes, section headings, and stat values. Provides a
            modern, geometric SaaS brand identity with tight tracking.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Geist Sans Variable</Text>
          <Text style={styles.cardText}>
            The primary sans-serif font applied to body copy, form labels, data
            table cells, and button interfaces.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Geist Mono Variable</Text>
          <Text style={styles.cardText}>
            Monospace font applied to timestamps, session IDs, token metrics,
            and technical API payloads.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Engineering & DevOps</Text>
        <Text style={styles.sectionTitle}>
          Development Toolchain, Quality Assurance & Deployment
        </Text>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Development Workflows & Testing</Text>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Package Management:
              </Text>{' '}
              Enforces{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>pnpm</Text> with
              pinned dependencies in{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                pnpm-lock.yaml
              </Text>
              .
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Unit Testing with Vitest:
              </Text>{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>pnpm test</Text>{' '}
              executes component and utility suites with mocked browser media
              APIs.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Formatting & Linting:
              </Text>{' '}
              Standardized via TanStack ESLint configuration and Prettier (
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                pnpm check
              </Text>
              ).
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Production Container & Cloud Deployment
          </Text>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Multi-Stage Dockerfile:
              </Text>{' '}
              Stage 1 builds the Nitro ESM bundle; Stage 2 prunes
              devDependencies; Stage 3 runs lean Node 20 slim image on port
              8080.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Firebase App Hosting:
              </Text>{' '}
              Configured via{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                apphosting.yaml
              </Text>{' '}
              with Google Cloud Secret Manager integration and dynamic
              autoscaling (0–10 instances, concurrency 80).
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Platform Architecture Specification • Confidential Internal
          Asset
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
)

// Execution script when run directly
async function generatePdf() {
  const outputPath = path.resolve(
    process.cwd(),
    'docs/EazyAI_Architecture_and_Platform_Guide.pdf',
  )
  console.log(`Generating EazyAI Specification PDF at: ${outputPath}...`)
  await ReactPDF.renderToFile(<EazyAiPlatformReport />, outputPath)
  console.log('PDF generation completed successfully!')
}

generatePdf().catch((err) => {
  console.error('Failed to generate PDF:', err)
  process.exit(1)
})
