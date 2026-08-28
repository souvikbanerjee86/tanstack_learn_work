import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer'
import { format } from 'date-fns'

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#09090b',
    color: '#fafafa',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#818cf8',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 8,
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  metaDate: {
    fontSize: 9,
    color: '#71717a',
    textAlign: 'right',
  },
  candidateCard: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  candidateName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  candidateEmail: {
    fontSize: 10,
    color: '#818cf8',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  metricLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    color: '#a1a1aa',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#818cf8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qnaBlock: {
    backgroundColor: '#141417',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  questionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 9,
    color: '#d4d4d8',
    marginBottom: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#a1a1aa',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#71717a',
  },
})

export interface InterviewPdfReportProps {
  candidateEmail: string
  jobId: string
  verdict: string
  technicalScore: number
  keywordScore: number
  trustScore: number
  answers: Array<{
    question: string
    answer: string
    score?: number
    feedback?: string
  }>
  evaluatorNotes?: string
}

export const InterviewPdfDocument = ({
  candidateEmail,
  jobId,
  verdict,
  technicalScore,
  keywordScore,
  trustScore,
  answers,
  evaluatorNotes,
}: InterviewPdfReportProps) => (
  <Document title={`EazyAI-Report-${candidateEmail}`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>EazyAI Intelligence</Text>
          <Text style={styles.brandSubtitle}>
            Candidate Multimodal Evaluation Report
          </Text>
        </View>
        <View>
          <Text style={styles.metaDate}>
            Generated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </Text>
          <Text style={styles.metaDate}>Requisition Ref: {jobId}</Text>
        </View>
      </View>

      {/* Candidate Profile Summary */}
      <View style={styles.candidateCard}>
        <Text style={styles.candidateName}>{candidateEmail}</Text>
        <Text style={styles.candidateEmail}>
          Audit Status: {verdict.toUpperCase()} • Multi-Sensor Verified
        </Text>
      </View>

      {/* Primary KPI Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Technical Evaluation</Text>
          <Text style={styles.metricValue}>{technicalScore}%</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Keyword Relevance</Text>
          <Text style={styles.metricValue}>{keywordScore}%</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Acoustic Trust Rating</Text>
          <Text style={styles.metricValue}>{trustScore}%</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Executive Verdict</Text>
          <Text
            style={[
              styles.metricValue,
              {
                color:
                  verdict === 'PASSED'
                    ? '#34d399'
                    : verdict === 'FAILED'
                      ? '#f87171'
                      : '#fbbf24',
              },
            ]}
          >
            {verdict}
          </Text>
        </View>
      </View>

      {/* Evaluator Notes if available */}
      {evaluatorNotes && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Evaluator Committee Notes</Text>
          <View style={styles.candidateCard}>
            <Text style={{ fontSize: 9, color: '#e4e4e7' }}>
              {evaluatorNotes}
            </Text>
          </View>
        </View>
      )}

      {/* Question & Technical Responses */}
      <Text style={styles.sectionTitle}>
        Question Analysis & Transcript Log ({answers.length})
      </Text>
      {answers.slice(0, 4).map((item, idx) => (
        <View key={idx} style={styles.qnaBlock}>
          <Text style={styles.questionText}>
            Q{idx + 1}: {item.question}
          </Text>
          <Text style={styles.answerText}>
            Candidate Response: {item.answer || 'No response recorded.'}
          </Text>
          <View style={styles.scoreRow}>
            <Text>Evaluation: {item.feedback || 'Evaluated by EazyAI'}</Text>
            {item.score !== undefined && (
              <Text>Score: {Math.round(item.score)}/100</Text>
            )}
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>EazyAI Multimodal Hiring Intelligence • Confidential</Text>
        <Text>Page 1 of 1</Text>
      </View>
    </Page>
  </Document>
)

export async function downloadInterviewPdf(
  props: InterviewPdfReportProps,
): Promise<void> {
  const blob = await pdf(<InterviewPdfDocument {...props} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `EazyAI_Report_${props.candidateEmail.replace(/[@.]/g, '_')}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
