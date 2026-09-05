import React from 'react'
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
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
    fontSize: 8.2,
    color: palette.slate700,
    lineHeight: 1.38,
  },

  // Running Header & Footer
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
    paddingBottom: 5,
  },
  runningHeaderTitle: {
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    color: palette.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  runningHeaderSub: {
    fontSize: 7,
    color: palette.slate400,
  },
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
    paddingTop: 5,
  },
  runningFooterText: {
    fontSize: 6.8,
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
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: palette.primary,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(165, 180, 252, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  brandPillText: {
    color: '#a5b4fc',
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.white,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
    lineHeight: 1.25,
    marginBottom: 5,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 8.2,
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
    fontSize: 6,
    color: palette.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
    fontFamily: 'Helvetica-Bold',
  },
  metaValue: {
    fontSize: 7,
    color: palette.white,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    gap: 6,
  },
  sectionTag: {
    backgroundColor: palette.primaryLight,
    borderWidth: 1,
    borderColor: palette.primaryBorder,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    color: palette.primaryDark,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate900,
    letterSpacing: 0.3,
  },
  sectionDesc: {
    fontSize: 8,
    color: palette.slate600,
    marginBottom: 7,
    lineHeight: 1.35,
  },

  // Cards and Grids
  cardGrid2: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cardGrid3: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  cardGrid4: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    backgroundColor: palette.slate50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.slate200,
    padding: 8,
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
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate900,
    marginBottom: 3,
  },
  cardText: {
    fontSize: 7.5,
    color: palette.slate600,
    lineHeight: 1.32,
  },

  // Visual Architectural Diagram Box
  diagramContainer: {
    backgroundColor: palette.slate900,
    borderRadius: 6,
    padding: 10,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: palette.slate800,
  },
  diagramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 4,
  },
  diagramTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  diagramBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    color: '#c7d2fe',
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
  },
  diagramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  diagramBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 6,
  },
  diagramBoxActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    borderColor: 'rgba(129, 140, 248, 0.4)',
  },
  diagramBoxTitle: {
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    color: palette.white,
    marginBottom: 2,
    textAlign: 'center',
  },
  diagramBoxDesc: {
    fontSize: 6,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  diagramBoxTag: {
    fontSize: 5.8,
    fontFamily: 'Helvetica-Bold',
    color: '#818cf8',
    textAlign: 'center',
    marginTop: 2,
  },
  diagramArrowCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  diagramArrowText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#818cf8',
  },
  diagramArrowLabel: {
    fontSize: 5.2,
    color: '#94a3b8',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },

  // Tables
  table: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.slate200,
    overflow: 'hidden',
    marginBottom: 8,
  },
  tableHeader: {
    backgroundColor: palette.slate100,
    flexDirection: 'row',
    paddingVertical: 4.5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: palette.slate200,
  },
  tableHeaderCell: {
    fontSize: 6.8,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3.8,
    paddingHorizontal: 6,
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
    fontSize: 7.2,
    color: palette.slate700,
  },
  tableCellBold: {
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    color: palette.slate900,
  },

  // Callout Box
  calloutBox: {
    backgroundColor: palette.primaryLight,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: palette.primaryBorder,
    padding: 7,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  calloutText: {
    flex: 1,
    fontSize: 7.3,
    color: palette.primaryDark,
    lineHeight: 1.32,
  },

  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2.5,
    paddingLeft: 3,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: palette.primary,
    marginTop: 4,
    marginRight: 5,
  },
  bulletText: {
    flex: 1,
    fontSize: 7.4,
    color: palette.slate600,
    lineHeight: 1.32,
  },
})

export const EazyAiPlatformReport = () => (
  <Document
    title="EazyAI Platform Architecture, Security & Full Implementation Specification"
    author="EazyAI Engineering Team"
    subject="Enterprise Talent Intelligence & Multimodal AI Interview Automation"
    keywords="TanStack Start, BFF, Google Cloud Run, Dialogflow CX, Vector RAG, Anti-Fraud, Glassmorphism"
  >
    {/* ========================================================================= */}
    {/* PAGE 1: COVER & EXECUTIVE OVERVIEW                                        */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          System Architecture, Security & Features Guide
        </Text>
      </View>

      <View style={styles.coverHeroBanner}>
        <View style={styles.brandRow}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'Helvetica-Bold',
              color: '#818cf8',
              letterSpacing: 1.5,
            }}
          >
            EAZYAI INTELLIGENCE
          </Text>
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>
              Architectural Whitepaper v1.0
            </Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>
          Autonomous Talent Intelligence & Multimodal AI Interviewing
        </Text>
        <Text style={styles.heroSubtitle}>
          Complete end-to-end technical specification: Zero-trust BFF
          orchestration, distributed microservices mesh, multimodal proctoring,
          acoustic deepfake detection, vector RAG search, and OKLCH frosted
          glassmorphism.
        </Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Core Framework</Text>
            <Text style={styles.metaValue}>TanStack Start + React 19</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Server Engine</Text>
            <Text style={styles.metaValue}>Nitro ESM + Google Cloud Run</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Security Architecture</Text>
            <Text style={styles.metaValue}>
              IAM Zero-Trust + HttpOnly Cookie
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Classification</Text>
            <Text style={styles.metaValue}>
              Technical Platform Specification
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Executive Brief</Text>
        <Text style={styles.sectionTitle}>
          1. Problem Statement & Platform Vision
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        Legacy recruitment infrastructures suffer from catastrophic failure
        modes: manual resume screening fatigue, inability to discern
        AI-hallucinated candidate CVs, vulnerability to proxy test takers, and
        subjective, uncalibrated interview scoring. EazyAI replaces disjointed
        tooling with an autonomous talent mesh unifying semantic vector
        indexing, conversational virtual agents, and biometric anti-fraud
        proctoring into a single portal.
      </Text>

      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>1. Semantic Vector RAG</Text>
          <Text style={styles.cardText}>
            Autonomous extraction, high-dimensional vector embeddings, and
            cosine similarity matching of candidate resumes against job
            requisition criteria with explicit gap detection.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>2. Multimodal AI Interviews</Text>
          <Text style={styles.cardText}>
            Autonomous conversational interviews powered by Dialogflow CX,
            featuring real-time speech-to-text, acoustic waveform playback,
            video streaming, and technical rubric scoring.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>3. Anti-Fraud Proctoring</Text>
          <Text style={styles.cardText}>
            Synthetic voice deepfake detection, computer vision webcam face
            verification, and gaze/window deviation tracking synthesized into a
            composite Trust Gauge (0-100%).
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Index</Text>
        <Text style={styles.sectionTitle}>Document Navigation Table</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Page</Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Section & Module
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '48%' }]}>
            Key Architectural Elements
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 2</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            System Architecture & Architectural Diagram
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            BFF Pattern, Nitro Engine, Full Visual System Diagram
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 3</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Zero-Trust Security & Auth Flow Diagram
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Firebase Admin Cookies, Google IAM OIDC Minting, RBAC Matrix
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 4</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Microservices API Specifications (Part 1)
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Jobs, Ingestion, Vector RAG Search & Storage Endpoints
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 5</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Microservices API Specs (Part 2) & External AI
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Dialogflow CX Sessions, OpenRouter LLM, Evaluation & Video
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 6</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Candidate Ingestion, Archive & Vector RAG
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            GCS Explorer, Corpus Indexing, Semantic Match Algorithm
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 7</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Question Bank, AI Generation & Simulator
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Rubric Calibrator, OpenRouter Prompts, Interactive Sandbox
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 8</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Multimodal Evaluation & Session Timeline
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Web Audio Visualizer, Video Streams, Dialogflow CX Turns
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 9</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Anti-Fraud Suite & Trust Gauge Diagram
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Deepfake Voice Detector, Face Cosine Match, Trust Formula
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 10</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Evaluator Workbench Copilot & PDF Dossiers
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            LocalStorage Scratchpad, Weighted Sliders, Email Inbound Sync
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 11</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Governance & Glassmorphism Design System
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            OKLCH Palette, Glass Tokens, Typography, ⌘K Command Palette
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '12%' }]}>Page 12</Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            DevOps, Deployment & Infrastructure Guide
          </Text>
          <Text style={[styles.tableCell, { width: '48%' }]}>
            Multi-Stage Dockerfile, Firebase App Hosting, Cloud Run
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 2: HIGH-LEVEL ARCHITECTURE & VISUAL DIAGRAM                          */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          System Architecture & Architectural Diagram
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Architecture Blueprint</Text>
        <Text style={styles.sectionTitle}>
          2. High-Level System Architecture
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI is architected around a Backend-For-Frontend (BFF) topology
        powered by TanStack Start and the Nitro server runtime. The diagram
        below illustrates the end-to-end component layers, network boundaries,
        and communication protocols.
      </Text>

      {/* Visual System Architecture Diagram */}
      <View
        style={{
          marginVertical: 6,
          borderRadius: 6,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#1e293b',
        }}
      >
        <Image
          src={path.join(process.cwd(), 'docs/diagrams/arch-diagram.png')}
          style={{ width: '100%', height: 245 }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Core Rationale</Text>
        <Text style={styles.sectionTitle}>
          BFF Architectural Design Principles
        </Text>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Why Backend-For-Frontend (BFF)?</Text>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Eliminates Client Secret Leakage:
              </Text>{' '}
              Cloud Run microservice URLs, Firebase Admin credentials, and
              OpenRouter API keys never touch the browser DOM or network
              bundles.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Enforces IAM Zero-Trust:
              </Text>{' '}
              Cloud Run microservices remain private (
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                ingress: internal-and-cloud-load-balancing
              </Text>
              ). Direct internet invocations are blocked with HTTP 403.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Prevents CORS Proliferation:
              </Text>{' '}
              The BFF aggregates responses from 20+ microservices on the server
              side, presenting a unified, typed API to the client.
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Nitro Server Engine & Hydration</Text>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                High-Performance ESM Bundle:
              </Text>{' '}
              Nitro compiles the server application to a lean standalone ESM
              bundle (
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                .output/server/index.mjs
              </Text>
              ) executing on Node 20.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Zero Layout Shift Hydration:
              </Text>{' '}
              Route loaders execute server queries via{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                ensureQueryData
              </Text>
              , transmitting dehydrated HTML directly to the browser.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                Native Cookie Streaming:
              </Text>{' '}
              Utilizes{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
                @tanstack/react-start/server
              </Text>{' '}
              cookie helpers (
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>getCookie</Text>
              ,{' '}
              <Text style={{ fontFamily: 'Helvetica-Oblique' }}>setCookie</Text>
              ) for seamless header injection.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 3: ZERO-TRUST SECURITY & AUTHENTICATION FLOW DIAGRAM                 */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Zero-Trust Security & Authentication Architecture
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Security Blueprint</Text>
        <Text style={styles.sectionTitle}>
          3. Zero-Trust Security & Authentication Protocol
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI establishes an airtight security perimeter. Authentication is
        decoupled into two isolated domains: (1) Client-to-BFF session
        management backed by Firebase Admin HTTP-only cookies, and (2)
        BFF-to-Cloud-Run machine-to-machine authentication enforcing Google
        Cloud IAM OIDC bearer token verification.
      </Text>

      {/* Visual Security Flow Diagram */}
      <View
        style={{
          marginVertical: 6,
          borderRadius: 6,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#1e293b',
        }}
      >
        <Image
          src={path.join(process.cwd(), 'docs/diagrams/security-diagram.png')}
          style={{ width: '100%', height: 235 }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>RBAC Governance</Text>
        <Text style={styles.sectionTitle}>
          Role-Based Access Control (RBAC) Matrix
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '18%' }]}>
            Role Title
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Scope of Authority
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '32%' }]}>
            Permitted Actions
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '28%' }]}>
            Restricted Operations
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '18%' }]}>
            Super Admin
          </Text>
          <Text style={[styles.tableCell, { width: '22%' }]}>
            Platform Governance
          </Text>
          <Text style={[styles.tableCell, { width: '32%' }]}>
            User role assignment, account restriction, site config, vector
            corpus triggers, full hiring operations
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            None (Full Administrative Control)
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '18%' }]}>
            Recruiter
          </Text>
          <Text style={[styles.tableCell, { width: '22%' }]}>
            Talent & Job Pipeline
          </Text>
          <Text style={[styles.tableCell, { width: '32%' }]}>
            Job creation/editing, resume uploads, vector RAG search, candidate
            comparison, scheduling
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Role modification, system configs
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '18%' }]}>
            Interviewer
          </Text>
          <Text style={[styles.tableCell, { width: '22%' }]}>
            Candidate Evaluation
          </Text>
          <Text style={[styles.tableCell, { width: '32%' }]}>
            Answer review, audio playback, video review, scratchpad notes,
            submit verdict (ACCEPT/REJECT)
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Job requisition deletion, admin panels
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '18%' }]}>
            Viewer / Auditor
          </Text>
          <Text style={[styles.tableCell, { width: '22%' }]}>
            Read-Only Inspection
          </Text>
          <Text style={[styles.tableCell, { width: '32%' }]}>
            Inspect dashboard metrics, view candidate profiles, read-only
            interview review, download PDF reports
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            All mutating operations, note edits
          </Text>
        </View>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Session Attack Surface Mitigation
          </Text>
          <Text style={styles.cardText}>
            Session cookies are protected by{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>HttpOnly: true</Text>{' '}
            (inaccessible to malicious scripts),
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              {' '}
              SameSite: 'lax'
            </Text>{' '}
            (blocks cross-site request forgery), and
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              {' '}
              Secure: true
            </Text>{' '}
            in production environments. Tokens are verified on every invocation.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Audience Scoping & Zero Token Replay
          </Text>
          <Text style={styles.cardText}>
            Every machine token generated by{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              google-auth-library
            </Text>{' '}
            is audience-restricted to the destination service URL. An
            intercepted token destined for the Job API cannot be replayed
            against the Anti-Fraud or RAG APIs.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 4: COMPLETE MICROSERVICES API SPECIFICATIONS (PART 1)                */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Microservices API Specification (Part 1)
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>API Catalog</Text>
        <Text style={styles.sectionTitle}>
          4. Microservices Catalog: Requisitions, Ingestion & Vector RAG
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        Downstream microservice endpoints are declared in{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>
          src/lib/api-path.ts
        </Text>
        . The table below specifies input payloads, response contracts, regions,
        and associated BFF server functions.
      </Text>

      {/* API Table Part 1 */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Service Key / Path
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Region</Text>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Input Schema / Parameters
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Output Data Contract
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>
            Server Function
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            JOB_DETAILS{'\n'}/api/jobs-list-api
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            limit?: number, cursor?: string, status?: 'Active' | 'Inactive'
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            PaginatedJobResponse: count, next_cursor, data: JobDetail[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            getJobDetails
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            ADD_JOB{'\n'}/jobs
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            jobTitle, jobDescription, jobType, experience, locations[], dates
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            JobPosting: id, status, createdAt
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            createJob
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            EDIT_JOB{'\n'}/jobs
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            jobId, jobTitle, jobDescription, locations[], status, experience
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            JobPosting: updated metadata record
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>editJob</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            CANDIDATE_LIST{'\n'}/api/candidates
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            limit?: number, cursor?: string, search?: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            PaginatedCandidateResponse: count, next_cursor, candidate[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            getCandidatesList
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            ADD_CANDIDATE{'\n'}/api/upload
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            FormData: file (PDF/DOCX), candidate_name, candidate_email
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            UploadResponse: id, resume_url, uploaded_at, candidate_id
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            addCandidate
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            ADD_MULTIPLE_CANDIDATES{'\n'}/api/v1/jobs/upload-cvs
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            FormData: files[] (batch multipart), job_id: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            MultipleCvUploadResponse: uploaded_files[], failed_files[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            addMultipleCandidates
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            BUCKET_LIST_API{'\n'}/api/list-objects
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            prefix: 'uploads', pageToken?: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            BucketListResponse: root_folders[], root_files[], next_page_token
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            fetchBucketListInfo
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            TRIGGER_INDEX{'\n'}/api/trigger-indexing
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            corpus_id: '1939767209815441408', selected_paths[]
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            IndexJobResponse: job_id, status: 'TRIGGERED', timestamp
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            triggerIndexes
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            RAG_SEARCH_API{'\n'}/api/rag_search
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            jobId, jobDescription, experience, skills, domain, file_ids[]
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            ProfileSearchResponse: matches: CandidateMatch[] (score, gaps)
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            getSearchProfileDetails
          </Text>
        </View>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Signed URL Generation for Media Assets
          </Text>
          <Text style={styles.cardText}>
            The{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              DOWNLOAD_FILE_URL
            </Text>{' '}
            and{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              DOWNLOAD_VOICE_FILE_URL
            </Text>{' '}
            services generate time-limited, signed Google Cloud Storage URLs.
            Resume PDFs and voice MP3s are accessed securely without exposing
            public bucket read permissions.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Indexed Files State Tracking</Text>
          <Text style={styles.cardText}>
            The{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              PROCESSED_FILES_ID
            </Text>{' '}
            endpoint delivers the complete list of document IDs persisted in the
            vector store. This powers the Archive Bank explorer, displaying
            real-time indexing status badges on resumes.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 5: COMPLETE MICROSERVICES API SPECS (PART 2) & EXTERNAL AI           */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Microservices API (Part 2) & External AI Gateways
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>API Catalog</Text>
        <Text style={styles.sectionTitle}>
          5. Evaluation, Anti-Fraud, Video & External AI Gateways
        </Text>
      </View>

      {/* API Table Part 2 */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Service Key / Path
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Region</Text>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Input Schema / Parameters
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Output Data Contract
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>
            Server Function
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            SPEECH_TO_TEXT{'\n'}/api/transcribe-v2
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            audio_gcs_uri: string, candidate_email: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            TranscribeResponse: text: string, confidence: number
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            transcribeCandidateAudio
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            VOICE_FRAUD_DETECTION{'\n'}/api/interview/audio-analysis
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            candidateEmail: string, jobId: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            AudioAnalysisResponse: overall_conclusion, confidence, records[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            getAudioAnalysisResultFn
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            FACE_DETECTION{'\n'}/api/match
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            webcam_base64: string, resume_photo_url: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            FaceMatchResponse: is_match: boolean, confidence: number
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            verifyFaceRecognition
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            MOVEMENT_OUTCOME{'\n'}/api/movement-detection
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            candidate_email: string, job_id: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            MovementOutcomeResponse: total_events, events: UserEvent[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            getMovementDetectionDetails
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            INTERVIEW_VIDEO_API{'\n'}/api/interview-video
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            candidate_email: string, session_id?: string
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            InterviewVideoResponse: count, data: InterviewVideoRecord[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            getInterviewVideoList
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            INTERVIEW_EVALUTE{'\n'}/api/evaluate
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            candidate_email, job_id, verdict: 'ACCEPT'|'REJECT', feedback
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            EvaluateResponse: status: 'SUCCESS', record_id
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            interviewEvaluate
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            ADMIN_USER_LIST / ACT{'\n'}/api/admin-users-list
          </Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>us-central1</Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            target_uid, role: string, disabled: boolean
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>
            AdminUserResponse: count, data: UserData[]
          </Text>
          <Text style={[styles.tableCellBold, { width: '20%' }]}>
            adminUsersList / adminActivity
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>AI Gateways</Text>
        <Text style={styles.sectionTitle}>
          External AI Gateways: Dialogflow CX & OpenRouter SDK
        </Text>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Dialogflow CX Runtime Protocol</Text>
          <Text style={styles.cardText}>
            The virtual interviewer is powered by{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              @google-cloud/dialogflow-cx
            </Text>
            . The BFF calls{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              client.projectLocationAgentSessionPath()
            </Text>{' '}
            to bind sessions to Project{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              project-716b1c69-ee04-40fd-ba6
            </Text>{' '}
            and Agent{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              01a7a4d2-bdec-43b9-9ab2-be8486843872
            </Text>
            . Transcribed candidate audio is processed via{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              detectIntent()
            </Text>
            , returning audio MP3 streams and intent parameters.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>OpenRouter LLM Synthesis</Text>
          <Text style={styles.cardText}>
            Integrates with{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              @openrouter/sdk
            </Text>{' '}
            using high-capacity models like{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              nvidia/nemotron-3-super-120b-a12b:free
            </Text>
            . The BFF formats role prompts in{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              getJobDescription
            </Text>{' '}
            and question generation modules, receiving calibrated job
            requisitions and evaluation rubrics without managing GPU
            infrastructure.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 6: RESUME INGESTION, ARCHIVE BANK & VECTOR RAG MATCHING              */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Candidate Ingestion, Archive Bank & Vector RAG
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Archive & Vector Search</Text>
        <Text style={styles.sectionTitle}>
          6. Resume Ingestion, Cloud Storage Bank & Vector RAG
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI integrates Google Cloud Storage bucket exploration with
        high-dimensional vector embeddings, enabling recruiters to ingest
        thousands of resumes, index them into a specialized corpus, and execute
        multi-dimensional semantic queries.
      </Text>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Archive Bank Explorer (/dashboard/import)
          </Text>
          <Text style={styles.cardText}>
            Provides an in-browser virtual file system directly querying Google
            Cloud Storage prefixes. Recruiters inspect folder trees, review
            document sizes and MIME types, download signed URLs, and select file
            subsets to trigger asynchronous vector re-indexing into Corpus{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              1939767209815441408
            </Text>
            .
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            High-Throughput Batch CV Ingestion
          </Text>
          <Text style={styles.cardText}>
            The drag-and-drop batch upload modal (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              add-multiple-candidates-dialog.tsx
            </Text>
            ) leverages multipart streaming (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              ADD_MULTIPLE_CANDIDATES
            </Text>
            ) to upload dozens of CVs concurrently. The pipeline parses
            applicant names, emails, and phone numbers, linking them to
            requisition IDs with real-time progress indicators.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Vector Discovery</Text>
        <Text style={styles.sectionTitle}>
          Semantic RAG Discovery Engine & Gap Analysis
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Scoring Dimension
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Vector Mechanics & Algorithmic Process
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '38%' }]}>
            Recruiter Actionable Output
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Match Score (0-100%)
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Cosine similarity computed between requisition query embedding and
            indexed resume text chunk embeddings.
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            Color-coded match badge for immediate candidate ranking.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Seniority Inference
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Heuristic deduction assessing total professional years, team
            leadership keywords, and architectural responsibilities.
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            Categorized as Junior, Mid, Senior, or Lead architect.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Matched Criteria
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Positive vector projection identifying explicit qualifications,
            frameworks, and domain expertise.
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            List of explicitly satisfied criteria with source citations.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Missing Information
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Negative constraint analysis identifying requisition requirements
            omitted or unverified in the candidate resume.
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            Flags skill gaps for focused questioning during interviews.
          </Text>
        </View>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Candidate Comparison Dialog</Text>
          <Text style={styles.cardText}>
            Side-by-side comparison modal (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              candidate-compare-dialog.tsx
            </Text>
            ) allowing recruiters to evaluate shortlisted candidates across
            match scores, experience levels, interview verdicts, and biometric
            trust gauges.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentAmber]}>
          <Text style={styles.cardTitle}>Competency Radar Visualization</Text>
          <Text style={styles.cardText}>
            The Skill Radar (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              candidate-skill-radar.tsx
            </Text>
            ) renders a Recharts polar chart depicting candidate mastery across
            core technical competencies versus target job benchmark
            requirements.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 7: QUESTION BANK, AI GENERATION & CANDIDATE SIMULATOR                */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Question Bank, AI Generation & Simulator
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Question Curation</Text>
        <Text style={styles.sectionTitle}>
          7. Requisition Question Bank & AI Question Synthesis
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI combines automated GenAI question formulation with manual
        recruiter governance to ensure assessment interviews are calibrated to
        requisition requirements and standardized across all candidates.
      </Text>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Requisition-Specific Question Repository
          </Text>
          <Text style={styles.cardText}>
            Managed via{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              /dashboard/questions
            </Text>
            . Questions are mapped directly to job IDs and categorized across
            technical coding, system design, architectural trade-offs, and
            behavioral communication. Recruiters can manually add, edit, or
            delete questions via{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              QUESTION_ADD
            </Text>{' '}
            and{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              QUESTION_DELETE
            </Text>
            .
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            GenAI Question Synthesis (QUESTION_ADD_AI)
          </Text>
          <Text style={styles.cardText}>
            Invokes an LLM microservice that parses the requisition title,
            description, and required tech stack. Synthesizes structured
            questions with evaluation rubrics, key terminology checklists, and
            expected answer criteria, ensuring interviewers have objective
            grading benchmarks.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Simulation Sandbox</Text>
        <Text style={styles.sectionTitle}>
          Interactive Candidate Experience Simulator
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        The Question Simulator (
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
          question-simulator-dialog.tsx
        </Text>
        ) allows hiring teams to step into the candidate shoes and test the
        automated interview flow before publishing questions live.
      </Text>

      {/* Simulator Flow Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Simulation Stage
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '42%' }]}>
            Sandbox Emulation Behavior
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '36%' }]}>
            Quality Assurance Objective
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            1. Introduction Turn
          </Text>
          <Text style={[styles.tableCell, { width: '42%' }]}>
            Virtual avatar introduces position, states rules, and prompts for
            candidate self-introduction.
          </Text>
          <Text style={[styles.tableCell, { width: '36%' }]}>
            Verify conversational clarity and pacing.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            2. Question Pacing
          </Text>
          <Text style={[styles.tableCell, { width: '42%' }]}>
            Delivers technical questions with countdown clocks, thinking time,
            and answer recording limits.
          </Text>
          <Text style={[styles.tableCell, { width: '36%' }]}>
            Calibrate time limits for complex design questions.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            3. Speech Transcription
          </Text>
          <Text style={[styles.tableCell, { width: '42%' }]}>
            Emulates microphone input and displays simulated real-time
            speech-to-text transcript output.
          </Text>
          <Text style={[styles.tableCell, { width: '36%' }]}>
            Check technical acronym transcription accuracy.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            4. Rubric Grading Preview
          </Text>
          <Text style={[styles.tableCell, { width: '42%' }]}>
            Shows immediate rubric comparison against simulated answer to
            preview scoring behavior.
          </Text>
          <Text style={[styles.tableCell, { width: '36%' }]}>
            Ensure rubric thresholds are realistic and fair.
          </Text>
        </View>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutText}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>
            Simulator Sandbox Isolation:{' '}
          </Text>
          The question simulator operates in complete isolation from the
          production candidate database. Test audio and transcripts generated
          during simulation sessions are flagged as test telemetry and never
          pollute candidate archives.
        </Text>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 8: MULTIMODAL EVALUATION & SESSION TIMELINE                          */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Multimodal Interview Evaluation & Session Timeline
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Multimodal Review</Text>
        <Text style={styles.sectionTitle}>
          8. Multimodal Interview Outcomes & Audio Player
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        The Interview Outcome dashboard (
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
          /dashboard/interview/$id
        </Text>
        ) unifies spoken transcripts, acoustic waveform players, video playback,
        and turn-by-turn conversational telemetry into an all-in-one recruiter
        console.
      </Text>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Answer Outcome & Rubric Inspector
          </Text>
          <Text style={styles.cardText}>
            The Answer Outcome component (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              answer-outcome.tsx
            </Text>
            ) displays candidate spoken answers aligned with question prompts.
            AI evaluation cards break down: (1) AI Verdict, (2) Domain
            competency score (0-100), (3) Structured technical reasoning, and
            (4) Keyword rubric inspector.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Web Audio API Waveform Visualizer
          </Text>
          <Text style={styles.cardText}>
            The Audio Waveform player (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              audio-waveform-player.tsx
            </Text>
            ) initializes an in-browser
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>
              {' '}
              AudioContext
            </Text>{' '}
            with real-time frequency-domain and time-domain canvas visualizers.
            Supports variable playback rates (0.75x, 1.0x, 1.25x, 1.5x, 2.0x)
            and interactive scrubber seeking.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Video Streaming</Text>
        <Text style={styles.sectionTitle}>
          Interview Video Streaming & Outcome Preview
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        The Video Outcome component (
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
          video-outcome.tsx
        </Text>
        ) streams interview video recordings directly from Google Cloud Storage
        via signed URLs (
        <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
          INTERVIEW_VIDEO_API
        </Text>
        ):
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Video Stream Metric
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '35%' }]}>
            Component Capability
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Recruiter Inspection Value
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Stream Playback
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            HTML5 Video with full transport controls, buffering indicators, and
            duration markers.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Inspect non-verbal communication and physical demeanor.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Metadata Tracking
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            File size formatting (e.g. 42.5 MB), MIME type (video/mp4), and
            session timestamps.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Verifies video integrity and completeness.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Time Synchronization
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            Synchronized timestamp markers matching question prompt intervals.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Jump directly to specific question video segments.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Telemetry</Text>
        <Text style={styles.sectionTitle}>
          Conversational Session Timeline & Token Telemetry
        </Text>
      </View>
      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>
            Turn-by-Turn Conversational Events
          </Text>
          <Text style={styles.cardText}>
            The Session Timeline (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              session-timeline.tsx
            </Text>
            ) reconstructs the complete Dialogflow CX conversational journey.
            Evaluators can inspect each node invocation, intent matched, thought
            signatures, and tool execution parameters.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentAmber]}>
          <Text style={styles.cardTitle}>Token Consumption Breakdown</Text>
          <Text style={styles.cardText}>
            Logs detailed token usage: Prompt Token Count, Candidate Token
            Count, Total Tokens Consumed, and modality splits (Text vs. Audio
            tokens). Ensures cost auditability across every candidate interview
            session.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 9: ANTI-FRAUD PROCTORING & TRUST GAUGE ARCHITECTURE                 */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Anti-Fraud Proctoring & Biometric Integrity Suite
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Biometric Security</Text>
        <Text style={styles.sectionTitle}>
          9. Anti-Fraud Proctoring & Trust Gauge Architecture
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        Remote recruitment is increasingly vulnerable to AI-assisted cheating,
        proxy test takers, and synthetic speech cloning. EazyAI combines
        acoustic waveform forensics, computer vision face verification, and
        proctoring telemetry into a unified trust score.
      </Text>

      {/* Visual Trust Gauge Architecture Box */}
      <View
        style={{
          marginVertical: 6,
          borderRadius: 6,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#1e293b',
        }}
      >
        <Image
          src={path.join(process.cwd(), 'docs/diagrams/trust-diagram.png')}
          style={{ width: '100%', height: 180 }}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Biometric Telemetry</Text>
        <Text style={styles.sectionTitle}>
          Anti-Fraud Verification Dimensions
        </Text>
      </View>

      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Face Anti-Impersonation</Text>
          <Text style={styles.cardText}>
            Compares webcam captures taken during the interview against
            candidate resume photos using neural face embeddings (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              FACE_DETECTION
            </Text>
            ). Detects candidate substitution or proxy attendance during live
            questions.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Acoustic Deepfake Detection</Text>
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

      {/* Trust Gauge Penalty Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Anomaly Type
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '28%' }]}>
            Detection Mechanism
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Trust Penalty
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '24%' }]}>
            Flag Severity
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '24%' }]}>
            Face Mismatch
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Cosine distance &gt; threshold
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>-35 Points</Text>
          <Text
            style={[
              styles.tableCellBold,
              { width: '24%', color: palette.rose },
            ]}
          >
            CRITICAL (Manual Review)
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '24%' }]}>
            Voice Cloning Detected
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Synthetic audio probability &gt; 80%
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>-35 Points</Text>
          <Text
            style={[
              styles.tableCellBold,
              { width: '24%', color: palette.rose },
            ]}
          >
            CRITICAL (Fraud Flag)
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '24%' }]}>
            Multiple Window Focus Loss
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Browser blur event count &gt; 4
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>-15 Points</Text>
          <Text
            style={[
              styles.tableCellBold,
              { width: '24%', color: palette.amber },
            ]}
          >
            WARNING (Proctor Alert)
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '24%' }]}>
            Continuous Gaze Deviation
          </Text>
          <Text style={[styles.tableCell, { width: '28%' }]}>
            Off-screen gaze for &gt; 12 seconds
          </Text>
          <Text style={[styles.tableCell, { width: '24%' }]}>-10 Points</Text>
          <Text
            style={[
              styles.tableCellBold,
              { width: '24%', color: palette.amber },
            ]}
          >
            WARNING (Cheating Risk)
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 10: EVALUATOR WORKBENCH COPILOT & PDF DOSSIERS                       */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Evaluator Workbench Copilot & Executive Dossiers
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Evaluator Copilot</Text>
        <Text style={styles.sectionTitle}>
          10. Evaluator Workbench Copilot & PDF Dossiers
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI equips interviewers with a client-side copilot environment for
        conducting synchronized, evidence-based evaluations with persistent
        scratchpad notes, weighted composite scoring sliders, and instant PDF
        dossier exports.
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
            keyed by candidate and job ID. Evaluators can jot observations
            during review without losing state on accidental browser reloads or
            tab closures.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Weighted Composite Scoring & Quick Verdicts
          </Text>
          <Text style={styles.cardText}>
            Includes dynamic weight sliders across Technical Competency,
            Communication, and Cultural Fit. Offers one-click verdict templates
            ("Strong Hire", "Solid Contender", "Reject - Technical Gap", "Reject
            - Integrity Flag") to accelerate hiring committee decisions.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Dossier Engine</Text>
        <Text style={styles.sectionTitle}>
          Client-Side Executive Candidate Dossier Export
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        Powered by{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>
          @react-pdf/renderer
        </Text>
        , the platform dynamically renders multi-page PDF candidate evaluation
        dossiers directly in the browser with zero server CPU overhead.
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '25%' }]}>
            Dossier Section
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Synthesized Data Elements
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '35%' }]}>
            Hiring Committee Value
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Executive Cover
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Candidate demographics, target job, interview date, composite score
            badge, and final verdict.
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            Instant C-suite executive briefing.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Trust & Integrity Gauge
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Visual Trust score, face match confidence, acoustic voice
            authenticity, proctoring anomalies.
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            Guarantees candidate authenticity.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Question Breakdown
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Question prompts, spoken answer transcripts, domain scores, and AI
            rubric rationale.
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            Auditable evaluation trail.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '25%' }]}>
            Recruiter Notes Block
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Persistent scratchpad observations, interviewer feedback,
            compensation notes, and signature.
          </Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>
            Formal recruitment record.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Automation</Text>
        <Text style={styles.sectionTitle}>
          Inbound Email Application Synchronization
        </Text>
      </View>
      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Automated Inbox Polling</Text>
          <Text style={styles.cardText}>
            The Email Sync microservice (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>EMAIL_SYNC</Text>)
            ingests candidate application emails sent to corporate hiring
            mailboxes, parsing applicant contact info, email text bodies, and
            attached resume files.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentAmber]}>
          <Text style={styles.cardTitle}>Auto-Requisition Mapping</Text>
          <Text style={styles.cardText}>
            The Email Reader dialog (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              email-reader-dialog.tsx
            </Text>
            ) allows recruiters to inspect the raw email, preview the attached
            resume, and confirm automated association with active Job
            Requisition IDs.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 11: GOVERNANCE & GLASSMORPHISM DESIGN SYSTEM                         */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          Enterprise Governance & Glassmorphism Design
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Design System</Text>
        <Text style={styles.sectionTitle}>
          11. Frosted Glassmorphism Design System (OKLCH)
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI is engineered to deliver a state-of-the-art visual experience.
        Built on{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>Tailwind CSS v4</Text>,
        the interface employs the{' '}
        <Text style={{ fontFamily: 'Helvetica-Bold' }}>OKLCH</Text> color space
        for vibrant, perceptually uniform tones that interact naturally with
        semi-transparent frosted glass layers.
      </Text>

      {/* Glassmorphism Specs Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Design Utility Token
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
        <Text style={styles.sectionTitle}>
          Typography Scale & Font Foundations
        </Text>
      </View>
      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Outfit Variable</Text>
          <Text style={styles.cardText}>
            Used for page heroes, section titles, and numerical stat cards.
            Delivers a high-contrast modern SaaS brand presence with tight
            letter tracking.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Geist Sans Variable</Text>
          <Text style={styles.cardText}>
            The primary sans-serif workhorse font applied to body text, form
            controls, table cells, and button labels.
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
        <Text style={styles.sectionTag}>Productivity</Text>
        <Text style={styles.sectionTitle}>
          Command Palette (⌘K) & Guided Onboarding Tour
        </Text>
      </View>
      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Global Search Palette (⌘K / Ctrl+K)
          </Text>
          <Text style={styles.cardText}>
            The Command Palette (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              global-search-dialog.tsx
            </Text>
            ) provides instant keyboard navigation across all dashboard routes,
            active jobs, candidate profiles, and admin tools with fuzzy search
            filtering.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>
            Interactive Onboarding Walkthrough
          </Text>
          <Text style={styles.cardText}>
            The Feature Tour dialog (
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              onboarding-tour-dialog.tsx
            </Text>
            ) guides new recruiters through the core workflows on first login.
            Progress is automatically cached in{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>localStorage</Text>.
          </Text>
        </View>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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
    {/* PAGE 12: DEVOPS, DEPLOYMENT & INFRASTRUCTURE GUIDE                        */}
    {/* ========================================================================= */}
    <Page size="A4" style={styles.page}>
      <View style={styles.runningHeader} fixed>
        <Text style={styles.runningHeaderTitle}>
          EazyAI Master Platform Specification
        </Text>
        <Text style={styles.runningHeaderSub}>
          DevOps, Deployment & Infrastructure Guide
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>DevOps & Deployment</Text>
        <Text style={styles.sectionTitle}>
          12. Production Deployment, Docker & Firebase App Hosting
        </Text>
      </View>
      <Text style={styles.sectionDesc}>
        EazyAI is designed for cloud-native deployment with zero downtime. The
        application container compiles into a standalone Nitro ESM server,
        optimized for Firebase App Hosting and Google Cloud Run.
      </Text>

      {/* Deployment Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: '22%' }]}>
            Deployment Target
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '38%' }]}>
            Configuration & Build Pipeline
          </Text>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>
            Operational & Scaling Characteristics
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Firebase App Hosting
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            Configured via apphosting.yaml. Automated builds with pnpm. Secrets
            mapped via Google Cloud Secret Manager.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Autoscaling: min 0, max 10 instances, concurrency: 80. Node options:
            --max-old-space-size=4096.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowOdd]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Google Cloud Run
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            Multi-stage Dockerfile packaging Node 20 slim image running
            .output/server/index.mjs on port 8080.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Serverless auto-scaling per request volume. Native Google Cloud IAM
            service account authentication.
          </Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={[styles.tableCellBold, { width: '22%' }]}>
            Local Development
          </Text>
          <Text style={[styles.tableCell, { width: '38%' }]}>
            Vite dev server (pnpm dev) with HMR, TanStack Router Devtools, and
            React Query Devtools on port 3000.
          </Text>
          <Text style={[styles.tableCell, { width: '40%' }]}>
            Local authentication via gcloud auth application-default login for
            seamless Cloud Run proxying.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Container Architecture</Text>
        <Text style={styles.sectionTitle}>
          Multi-Stage Docker Container Architecture
        </Text>
      </View>

      <View style={styles.cardGrid3}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>Stage 1: Builder</Text>
          <Text style={styles.cardText}>
            Installs full devDependencies, copies source files, passes
            build-time client Firebase config args, and compiles the Nitro
            application via{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>pnpm build</Text>.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Stage 2: Prod-Deps</Text>
          <Text style={styles.cardText}>
            Executes{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              pnpm install --prod --frozen-lockfile
            </Text>
            , pruning devDependencies and build tools to produce a minimal,
            secure node_modules footprint.
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentEmerald]}>
          <Text style={styles.cardTitle}>Stage 3: Runner</Text>
          <Text style={styles.cardText}>
            Copies the compiled{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>.output</Text>{' '}
            bundle and production node_modules into a clean Node 20 slim
            runtime. Exposes port 8080 and executes via{' '}
            <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
              node .output/server/index.mjs
            </Text>
            .
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTag}>Quality Assurance</Text>
        <Text style={styles.sectionTitle}>
          Testing, Linting & CI/CD Verification
        </Text>
      </View>

      <View style={styles.cardGrid2}>
        <View style={[styles.card, styles.cardAccentPrimary]}>
          <Text style={styles.cardTitle}>
            Automated Unit Testing with Vitest
          </Text>
          <Text style={styles.cardText}>
            Run via{' '}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>pnpm test</Text>.
            Validates components, form validation schemas, and media helpers
            with mocked browser APIs (HTMLMediaElement, AudioContext).
          </Text>
        </View>
        <View style={[styles.card, styles.cardAccentViolet]}>
          <Text style={styles.cardTitle}>Linting & Formatting Standard</Text>
          <Text style={styles.cardText}>
            Standardized via TanStack ESLint rules and Prettier (
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>pnpm check</Text>).
            Enforces strict TypeScript type checking, import sorting, and
            formatting rules across all modules.
          </Text>
        </View>
      </View>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutText}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>
            PDF Specification Generation:{' '}
          </Text>
          This document is generated programmatically using{' '}
          <Text style={{ fontFamily: 'Helvetica-Oblique' }}>
            @react-pdf/renderer
          </Text>{' '}
          via{' '}
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>pnpm docs:pdf</Text>.
          Any updates to API endpoints, architectural topologies, or design
          tokens can be instantly compiled into a fresh PDF specification.
        </Text>
      </View>

      <View style={styles.runningFooter} fixed>
        <Text style={styles.runningFooterText}>
          EazyAI Master Technical Specification • Sanitized Architecture
          Document
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

async function generatePdf() {
  const outputPath = path.resolve(
    process.cwd(),
    'docs/EazyAI_Architecture_and_Platform_Guide.pdf',
  )
  console.log(`Generating EazyAI Master Specification PDF at: ${outputPath}...`)
  await ReactPDF.renderToFile(<EazyAiPlatformReport />, outputPath)
  console.log('Master PDF generation completed successfully!')
}

generatePdf().catch((err) => {
  console.error('Failed to generate PDF:', err)
  process.exit(1)
})
