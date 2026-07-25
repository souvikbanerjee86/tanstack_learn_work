import { Document, Page, Text, View, StyleSheet, Svg, Path, Circle } from '@react-pdf/renderer';
import { EvaluationData, InterviewRecord, UserMovementData } from '@/lib/types';

// Premium Corporate Palette
const colors = {
    primary: '#4f46e5',        // Royal Indigo
    primaryLight: '#eef2ff',   // Soft Violet Tint
    primaryDark: '#3730a3',    // Deep Violet
    accentPurple: '#7c3aed',   // Bright Purple
    slateDark: '#090d16',      // Midnight Dark
    slateHeader: '#1e1b4b',    // Dark Purple-Slate Header
    slateCard: '#0f172a',      // Slate Dark Card Header
    slateBody: '#334155',      // Body Text Slate
    slateMuted: '#64748b',     // Subtitle Slate
    bgLight: '#f8fafc',        // Card Background Light
    bgSubtle: '#f1f5f9',       // Secondary Light BG
    border: '#e2e8f0',         // Soft Border
    borderDark: '#cbd5e1',     // Stronger Border
    emerald: '#059669',        // Success Emerald Green
    emeraldBg: '#ecfdf5',      // Success Green Tint
    emeraldBorder: '#a7f3d0',
    amber: '#d97706',          // Warning Amber Gold
    amberBg: '#fffbe6',        // Warning Gold Tint
    amberBorder: '#fde68a',
    rose: '#e11d48',           // Alert Rose Red
    roseBg: '#fff1f2',         // Alert Red Tint
    roseBorder: '#fecdd3',
    white: '#ffffff',
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 32,
        paddingBottom: 48,
        paddingHorizontal: 32,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: colors.slateBody,
    },
    
    // Top Executive Header Banner
    headerBanner: {
        backgroundColor: colors.slateDark,
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: colors.accentPurple,
    },
    brandTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 3,
    },
    brandTitle: {
        fontSize: 15,
        fontFamily: 'Helvetica-Bold',
        color: colors.white,
        letterSpacing: 0.8,
    },
    brandSubtitle: {
        fontSize: 7.5,
        color: '#a5b4fc',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontFamily: 'Helvetica-Bold',
    },
    confidentialPill: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(165, 180, 252, 0.4)',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
    },
    confidentialText: {
        color: colors.white,
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1.2,
    },

    // Candidate & Metadata Grid Card
    metaCard: {
        flexDirection: 'row',
        backgroundColor: colors.bgLight,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 10,
        marginBottom: 14,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaCol: {
        flexDirection: 'column',
        gap: 2,
    },
    metaLabel: {
        fontSize: 6.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    metaValue: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
    },

    // Dashboard Overview Stats (4 Cards)
    dashboardGrid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 14,
    },
    dashCard: {
        flex: 1,
        backgroundColor: colors.bgLight,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    dashCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    dashCardLabel: {
        fontSize: 6.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dashCardValue: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
    },
    dashCardSub: {
        fontSize: 7,
        color: colors.slateMuted,
        marginTop: 2,
    },
    dashPill: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    dashPillText: {
        fontSize: 6.5,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
    },

    // Visual Progress Bar Component
    progressBarBg: {
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 4,
    },
    progressBarFill: {
        height: 4,
        borderRadius: 2,
    },

    // Section Titles
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 8,
        borderBottomWidth: 1.5,
        borderBottomColor: colors.primary,
        paddingBottom: 4,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionTitle: {
        fontSize: 10.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    sectionBadge: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },

    // Question Card
    questionCard: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    questionHeader: {
        backgroundColor: colors.slateHeader,
        padding: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionNumPill: {
        backgroundColor: colors.primary,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 6,
    },
    questionNumText: {
        color: colors.white,
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
    },
    questionTitle: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.white,
        flex: 1,
        marginRight: 6,
    },
    questionScoreBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    questionScoreText: {
        color: colors.white,
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
    },
    answerContent: {
        padding: 9,
        backgroundColor: colors.white,
    },
    transcriptBox: {
        backgroundColor: colors.primaryLight,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
        padding: 8,
        marginBottom: 6,
        borderRadius: 4,
        position: 'relative',
    },
    transcriptLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 3,
    },
    transcriptLabel: {
        fontSize: 6.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.primaryDark,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    transcriptText: {
        fontSize: 8,
        fontStyle: 'italic',
        color: colors.slateDark,
        lineHeight: 1.35,
    },
    aiFeedbackBox: {
        backgroundColor: colors.bgLight,
        padding: 7,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 6,
    },
    aiFeedbackLabel: {
        fontSize: 6.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    aiFeedbackText: {
        fontSize: 7.5,
        color: colors.slateBody,
        lineHeight: 1.3,
    },
    diagnosticsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 5,
        marginTop: 2,
    },
    diagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.bgLight,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    diagLabel: {
        fontSize: 7,
        color: colors.slateMuted,
    },
    diagStatusPass: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: colors.emerald,
    },
    diagStatusFail: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: colors.rose,
    },

    // Voice Audit Card
    voiceCard: {
        backgroundColor: colors.bgLight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 9,
        marginBottom: 8,
    },
    voiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    voiceConclusionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        borderWidth: 1,
    },
    voiceConclusionText: {
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
    },
    voiceConfidenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    voiceConfidenceText: {
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
    },
    voiceReasoning: {
        fontSize: 7.5,
        color: colors.slateBody,
        lineHeight: 1.3,
        marginBottom: 6,
        fontStyle: 'italic',
    },
    voiceMeta: {
        fontSize: 6.5,
        color: colors.slateMuted,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 4,
    },

    // Movement Log Table
    table: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 6,
        overflow: 'hidden',
        marginTop: 4,
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.slateHeader,
        padding: 5,
        paddingHorizontal: 8,
    },
    tableHeaderCell: {
        color: colors.white,
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        padding: 5,
        paddingHorizontal: 8,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    tableRowAlt: {
        backgroundColor: colors.bgLight,
    },
    tableCell: {
        fontSize: 7.5,
        color: colors.slateBody,
    },
    categoryPill: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3,
        alignSelf: 'flex-start',
    },

    // Admin Feedback Card
    adminFeedbackCard: {
        backgroundColor: colors.bgLight,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        padding: 10,
        marginBottom: 12,
    },
    adminFeedbackHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 4,
    },
    adminFeedbackTitle: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: colors.primaryDark,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    adminFeedbackText: {
        fontSize: 8.5,
        fontStyle: 'italic',
        color: colors.slateDark,
        lineHeight: 1.35,
    },
    adminPendingCard: {
        backgroundColor: colors.amberBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.amberBorder,
        borderLeftWidth: 4,
        borderLeftColor: colors.amber,
        padding: 10,
        marginBottom: 12,
    },
    adminPendingText: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.amber,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 18,
        left: 32,
        right: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 6,
    },
    footerText: {
        fontSize: 6.5,
        color: colors.slateMuted,
    },
});

// Inline Vector Icons for React-PDF
const ShieldIcon = () => (
    <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={colors.primary} />
    </Svg>
);

const CheckIcon = () => (
    <Svg width={10} height={10} viewBox="0 0 24 24">
        <Path d="M20 6L9 17l-5-5" stroke={colors.emerald} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
);

const CrossIcon = () => (
    <Svg width={10} height={10} viewBox="0 0 24 24">
        <Path d="M18 6L6 18M6 6l12 12" stroke={colors.rose} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
);

const TargetIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" fill="none" />
        <Circle cx="12" cy="12" r="6" stroke={colors.accentPurple} strokeWidth="2" fill="none" />
        <Circle cx="12" cy="12" r="2" fill={colors.primary} />
    </Svg>
);

const AudioWaveIcon = () => (
    <Svg width={12} height={12} viewBox="0 0 24 24">
        <Path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Svg>
);

interface InterviewPDFReportProps {
    email: string;
    id: string;
    evaluation?: string;
    feedback?: string;
    answers?: EvaluationData[];
    voiceAnswers?: InterviewRecord[];
    movementData?: UserMovementData[];
}

export function InterviewPDFReport({
    email,
    id,
    evaluation = 'PENDING',
    feedback,
    answers = [],
    voiceAnswers = [],
    movementData = [],
}: InterviewPDFReportProps) {
    const scores = answers.map((a) => a.score ?? 0);
    const totalScore = scores.reduce((acc, curr) => acc + curr, 0);
    const maxScore = answers.length * 100;
    const avgScoreNum = answers.length > 0 ? totalScore / answers.length : 0;
    const avgScoreStr = avgScoreNum.toFixed(1);

    const getScoreClassification = (val: number) => {
        if (val > 35) return { label: 'Superior Alignment', color: colors.emerald, bg: colors.emeraldBg, border: colors.emeraldBorder };
        if (val >= 25) return { label: 'Balanced Fit', color: colors.amber, bg: colors.amberBg, border: colors.amberBorder };
        return { label: 'Critical Gaps', color: colors.rose, bg: colors.roseBg, border: colors.roseBorder };
    };

    const classification = getScoreClassification(totalScore);
    const movementSummary = movementData[0];
    const totalInfractions = movementSummary?.total_events ?? 0;
    const proctorRisk = totalInfractions === 0 ? { label: 'Low Risk', color: colors.emerald, bg: colors.emeraldBg } : totalInfractions <= 3 ? { label: 'Moderate Risk', color: colors.amber, bg: colors.amberBg } : { label: 'High Risk', color: colors.rose, bg: colors.roseBg };

    const voiceSummary = voiceAnswers[0];
    const voiceConclusion = voiceSummary?.analysis_result?.conclusion || 'Human';
    const voiceConfidence = voiceSummary?.analysis_result?.confidence_score
        ? (voiceSummary.analysis_result.confidence_score * 100).toFixed(0)
        : '95';

    return (
        <Document title={`Interview Evaluation Audit - ${email}`}>
            <Page size="A4" style={styles.page}>
                {/* Header Banner */}
                <View style={styles.headerBanner}>
                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <View style={styles.brandTitleRow}>
                            <ShieldIcon />
                            <Text style={styles.brandTitle}>EAZYAI INTELLIGENCE REPORT</Text>
                        </View>
                        <Text style={styles.brandSubtitle}>Forensic Evaluation & Multi-Dimensional Candidate Audit</Text>
                    </View>
                    <View style={styles.confidentialPill}>
                        <Text style={styles.confidentialText}>OFFICIAL AUDIT</Text>
                    </View>
                </View>

                {/* Candidate Metadata Overview */}
                <View style={styles.metaCard}>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Candidate Email</Text>
                        <Text style={styles.metaValue}>{email}</Text>
                    </View>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Audit Reference ID</Text>
                        <Text style={styles.metaValue}>{id}</Text>
                    </View>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Evaluation Verdict</Text>
                        <Text style={[styles.metaValue, { color: evaluation === 'EVALUATED' ? colors.emerald : colors.amber }]}>
                            {evaluation}
                        </Text>
                    </View>
                    <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Audit Date</Text>
                        <Text style={styles.metaValue}>{new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

                {/* Dashboard Summary (4 Stats Cards) */}
                <View style={styles.dashboardGrid}>
                    {/* Card 1: Aggregate Score */}
                    <View style={styles.dashCard}>
                        <View style={styles.dashCardHeader}>
                            <Text style={styles.dashCardLabel}>Overall Score</Text>
                            <TargetIcon />
                        </View>
                        <Text style={styles.dashCardValue}>{totalScore} <Text style={{ fontSize: 9, color: colors.slateMuted }}>/ {answers.length * 10}</Text></Text>
                        <View style={[styles.dashPill, { backgroundColor: classification.bg, borderColor: classification.border, borderWidth: 1 }]}>
                            <Text style={[styles.dashPillText, { color: classification.color }]}>{classification.label}</Text>
                        </View>
                    </View>

                    {/* Card 2: Question Quality */}
                    <View style={styles.dashCard}>
                        <View style={styles.dashCardHeader}>
                            <Text style={styles.dashCardLabel}>Avg Response Score</Text>
                        </View>
                        <Text style={styles.dashCardValue}>{avgScoreStr} <Text style={{ fontSize: 9, color: colors.slateMuted }}>/ 10</Text></Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(0, (avgScoreNum / 10) * 100))}%`, backgroundColor: colors.primary }]} />
                        </View>
                        <Text style={styles.dashCardSub}>{answers.length} Questions Evaluated</Text>
                    </View>

                    {/* Card 3: Voice Biometrics */}
                    <View style={styles.dashCard}>
                        <View style={styles.dashCardHeader}>
                            <Text style={styles.dashCardLabel}>Voice Verdict</Text>
                            <AudioWaveIcon />
                        </View>
                        <Text style={[styles.dashCardValue, { color: voiceConclusion === 'Human' ? colors.emerald : colors.rose, fontSize: 13 }]}>
                            {voiceConclusion}
                        </Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${voiceConfidence}%`, backgroundColor: voiceConclusion === 'Human' ? colors.emerald : colors.rose }]} />
                        </View>
                        <Text style={styles.dashCardSub}>{voiceConfidence}% Confidence</Text>
                    </View>

                    {/* Card 4: Proctoring Risk */}
                    <View style={styles.dashCard}>
                        <View style={styles.dashCardHeader}>
                            <Text style={styles.dashCardLabel}>Proctor Risk</Text>
                        </View>
                        <Text style={[styles.dashCardValue, { color: proctorRisk.color }]}>{totalInfractions} <Text style={{ fontSize: 9, color: colors.slateMuted }}>Flags</Text></Text>
                        <View style={[styles.dashPill, { backgroundColor: proctorRisk.bg }]}>
                            <Text style={[styles.dashPillText, { color: proctorRisk.color }]}>{proctorRisk.label}</Text>
                        </View>
                    </View>
                </View>

                {/* Admin Evaluation & Feedback Section */}
                <View style={styles.sectionHeader} wrap={false}>
                    <View style={styles.sectionTitleRow}>
                        <ShieldIcon />
                        <Text style={styles.sectionTitle}>Admin Evaluation & Feedback</Text>
                    </View>
                    <Text style={[styles.sectionBadge, { backgroundColor: feedback ? colors.emeraldBg : colors.amberBg, color: feedback ? colors.emerald : colors.amber }]}>
                        {feedback ? 'EVALUATED' : 'PENDING'}
                    </Text>
                </View>

                {feedback ? (
                    <View style={styles.adminFeedbackCard} wrap={false}>
                        <View style={styles.adminFeedbackHeader}>
                            <Text style={styles.adminFeedbackTitle}>Admin Comments & Remarks</Text>
                        </View>
                        <Text style={styles.adminFeedbackText}>"{feedback}"</Text>
                    </View>
                ) : (
                    <View style={styles.adminPendingCard} wrap={false}>
                        <Text style={styles.adminPendingText}>Evaluation of Admin is Pending</Text>
                    </View>
                )}

                {/* Section 1: Technical Answer Outcomes */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={styles.sectionTitle}>Technical Response Audit</Text>
                    </View>
                    <Text style={styles.sectionBadge}>{answers.length} Questions</Text>
                </View>

                {answers.length === 0 ? (
                    <Text style={{ fontStyle: 'italic', color: colors.slateMuted, marginVertical: 6 }}>
                        No technical answer records found for this candidate.
                    </Text>
                ) : (
                    answers.map((item, idx) => (
                        <View key={idx} style={styles.questionCard} wrap={false}>
                            <View style={styles.questionHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View style={styles.questionNumPill}>
                                        <Text style={styles.questionNumText}>Q{idx + 1}</Text>
                                    </View>
                                    <Text style={styles.questionTitle}>{item.question}</Text>
                                </View>
                                <View style={styles.questionScoreBadge}>
                                    <Text style={styles.questionScoreText}>Impact: {item.score ?? 0} / 10</Text>
                                </View>
                            </View>

                            <View style={styles.answerContent}>
                                {/* Candidate Transcript */}
                                <View style={styles.transcriptBox}>
                                    <View style={styles.transcriptLabelRow}>
                                        <Text style={styles.transcriptLabel}>Candidate Transcript</Text>
                                    </View>
                                    <Text style={styles.transcriptText}>"{item.answer}"</Text>
                                </View>

                                {/* AI Reasoning */}
                                <View style={styles.aiFeedbackBox}>
                                    <Text style={styles.aiFeedbackLabel}>AI Feedback & Analysis</Text>
                                    <Text style={styles.aiFeedbackText}>
                                        {item.reasoning || 'No detailed reasoning recorded.'}
                                    </Text>
                                </View>

                                {/* Diagnostics */}
                                <View style={styles.diagnosticsRow}>
                                    <View style={styles.diagItem}>
                                        {item.answer_evaluation ? <CheckIcon /> : <CrossIcon />}
                                        <Text style={styles.diagLabel}>Logic Consistency:</Text>
                                        <Text style={item.answer_evaluation ? styles.diagStatusPass : styles.diagStatusFail}>
                                            {item.answer_evaluation ? 'PASS' : 'FLAGGED'}
                                        </Text>
                                    </View>
                                    <View style={styles.diagItem}>
                                        {item.text_evaluation ? <CheckIcon /> : <CrossIcon />}
                                        <Text style={styles.diagLabel}>Identity Match:</Text>
                                        <Text style={item.text_evaluation ? styles.diagStatusPass : styles.diagStatusFail}>
                                            {item.text_evaluation ? 'PASS' : 'FLAGGED'}
                                        </Text>
                                    </View>
                                    <View style={styles.diagItem}>
                                        {item.voice_evaluation ? <CheckIcon /> : <CrossIcon />}
                                        <Text style={styles.diagLabel}>Voice Biometrics:</Text>
                                        <Text style={item.voice_evaluation ? styles.diagStatusPass : styles.diagStatusFail}>
                                            {item.voice_evaluation ? 'PASS' : 'FLAGGED'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                {/* Section 2: Audio & Forensic Outcome */}
                <View style={styles.sectionHeader} wrap={false}>
                    <View style={styles.sectionTitleRow}>
                        <AudioWaveIcon />
                        <Text style={styles.sectionTitle}>Voice Audit & Forensic Deep-Dive</Text>
                    </View>
                    <Text style={styles.sectionBadge}>{voiceAnswers.length} Samples</Text>
                </View>

                {voiceAnswers.length === 0 ? (
                    <Text style={{ fontStyle: 'italic', color: colors.slateMuted, marginVertical: 6 }}>
                        No voice audit records available for this session.
                    </Text>
                ) : (
                    voiceAnswers.map((voice, idx) => {
                        const isHuman = voice.analysis_result?.conclusion === 'Human';
                        const confidence = ((voice.analysis_result?.confidence_score ?? 0) * 100).toFixed(0);

                        return (
                            <View key={idx} style={styles.voiceCard} wrap={false}>
                                <View style={styles.voiceHeader}>
                                    <View
                                        style={[
                                            styles.voiceConclusionBadge,
                                            {
                                                backgroundColor: isHuman ? colors.emeraldBg : colors.roseBg,
                                                borderColor: isHuman ? colors.emeraldBorder : colors.roseBorder,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.voiceConclusionText,
                                                { color: isHuman ? colors.emerald : colors.rose },
                                            ]}
                                        >
                                            Conclusion: {voice.analysis_result?.conclusion || 'Unverified'}
                                        </Text>
                                    </View>
                                    <View style={styles.voiceConfidenceRow}>
                                        <Text style={styles.voiceConfidenceText}>Confidence Score: {confidence}%</Text>
                                    </View>
                                </View>

                                <Text style={styles.voiceReasoning}>
                                    "{voice.analysis_result?.reasoning || 'No forensic reasoning provided.'}"
                                </Text>

                                <Text style={styles.voiceMeta}>
                                    GCS URI: {voice.gcs_uri || 'N/A'} • Timestamp: {new Date(voice.timestamp).toLocaleString()}
                                </Text>
                            </View>
                        );
                    })
                )}

                {/* Section 3: Movement & Proctoring Audit */}
                <View style={styles.sectionHeader} wrap={false}>
                    <Text style={styles.sectionTitle}>Proctoring & Incident Timeline Log</Text>
                    <Text style={styles.sectionBadge}>{totalInfractions} Infractions</Text>
                </View>

                {!movementSummary || !movementSummary.events || movementSummary.events.length === 0 ? (
                    <Text style={{ fontStyle: 'italic', color: colors.emerald, marginVertical: 6 }}>
                        ✓ Zero proctoring infractions detected during this session.
                    </Text>
                ) : (
                    <View style={styles.table} wrap={false}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { width: '22%' }]}>Timestamp</Text>
                            <Text style={[styles.tableHeaderCell, { width: '28%' }]}>Category</Text>
                            <Text style={[styles.tableHeaderCell, { width: '50%' }]}>Incident Reason / Description</Text>
                        </View>
                        {movementSummary.events.map((evt, idx) => {
                            const isFace = evt.reason.toLowerCase().includes('face');
                            const isFocus = evt.reason.toLowerCase().includes('browser');
                            const category = isFace ? 'Face Tracking' : isFocus ? 'Focus Lost' : 'Violation';
                            const categoryBg = isFace ? colors.amberBg : isFocus ? colors.primaryLight : colors.roseBg;
                            const categoryColor = isFace ? colors.amber : isFocus ? colors.primary : colors.rose;

                            return (
                                <View
                                    key={idx}
                                    style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                                >
                                    <Text style={[styles.tableCell, { width: '22%', fontFamily: 'Helvetica-Bold' }]}>
                                        {evt.time}
                                    </Text>
                                    <View style={{ width: '28%' }}>
                                        <View style={[styles.categoryPill, { backgroundColor: categoryBg }]}>
                                            <Text style={{ fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: categoryColor }}>
                                                {category}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.tableCell, { width: '50%' }]}>{evt.reason}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        EazyAI Intelligence Systems • Automated Candidate Audit Report • Confidential
                    </Text>
                    <Text
                        style={styles.footerText}
                        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                    />
                </View>
            </Page>
        </Document>
    );
}
