import { Document, Page, Text, View, StyleSheet, Svg, Path } from '@react-pdf/renderer';
import { JobDetail } from '@/lib/types';
import { format } from 'date-fns';

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
        borderLeftColor: colors.primary,
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

    // Job Title Hero Card
    heroCard: {
        backgroundColor: colors.primaryLight,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#c7d2fe',
        padding: 14,
        marginBottom: 14,
    },
    jobStatusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.emeraldBg,
        borderWidth: 1,
        borderColor: colors.emeraldBorder,
        borderRadius: 4,
        paddingHorizontal: 7,
        paddingVertical: 2.5,
        marginBottom: 6,
    },
    jobStatusText: {
        color: colors.emerald,
        fontSize: 7.5,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    heroJobTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
        marginBottom: 4,
    },
    heroJobId: {
        fontSize: 8,
        fontFamily: 'Helvetica',
        color: colors.slateMuted,
        letterSpacing: 0.5,
    },

    // Requisition Parameter Grid
    paramGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
    },
    paramCard: {
        flex: 1,
        minWidth: '22%',
        backgroundColor: colors.bgLight,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 8,
    },
    paramLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 3,
    },
    paramValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
    },

    // Specification Section
    specContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: 14,
    },
    specHeader: {
        backgroundColor: colors.bgSubtle,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    specHeaderText: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: colors.slateDark,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    specBody: {
        padding: 14,
        fontSize: 8.5,
        lineHeight: 1.6,
        color: colors.slateBody,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 32,
        right: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 8,
    },
    footerText: {
        fontSize: 7,
        color: colors.slateMuted,
        letterSpacing: 0.5,
    },
    pageNumber: {
        fontSize: 7,
        color: colors.slateMuted,
        fontFamily: 'Helvetica-Bold',
    }
});

interface JobPDFReportProps {
    job: JobDetail;
}

export function JobPDFReport({ job }: JobPDFReportProps) {
    const formattedCreatedDate = job.created_at 
        ? format(new Date(job.created_at), "MMM d, yyyy") 
        : format(new Date(), "MMM d, yyyy");

    const formattedStartDate = job.start_date
        ? format(new Date(job.start_date), "MMM d, yyyy")
        : null;

    const formattedEndDate = job.end_date
        ? format(new Date(job.end_date), "MMM d, yyyy")
        : "Open Ongoing";

    const statusUpper = (job.status || 'Active').toUpperCase();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* 1. Header Banner */}
                <View style={styles.headerBanner}>
                    <View>
                        <View style={styles.brandTitleRow}>
                            <Svg width="14" height="14" viewBox="0 0 24 24">
                                <Path
                                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                    stroke="#818cf8"
                                    strokeWidth="2.5"
                                    fill="none"
                                />
                            </Svg>
                            <Text style={styles.brandTitle}>EazyAI Talent Engine</Text>
                        </View>
                        <Text style={styles.brandSubtitle}>Job Requisition Specification Dossier</Text>
                    </View>

                    <View style={styles.confidentialPill}>
                        <Text style={styles.confidentialText}>OFFICIAL REQUISITION</Text>
                    </View>
                </View>

                {/* 2. Hero Card */}
                <View style={styles.heroCard}>
                    <View style={styles.jobStatusBadge}>
                        <Text style={styles.jobStatusText}>Status: {statusUpper}</Text>
                    </View>
                    <Text style={styles.heroJobTitle}>{job.job_title}</Text>
                    <Text style={styles.heroJobId}>Requisition ID: {job.job_id} | Document Generated: {format(new Date(), "PPpp")}</Text>
                </View>

                {/* 3. Parameters Grid */}
                <View style={styles.paramGrid}>
                    <View style={styles.paramCard}>
                        <Text style={styles.paramLabel}>Primary Location</Text>
                        <Text style={styles.paramValue}>{job.location || 'Not Specified'}</Text>
                    </View>

                    <View style={styles.paramCard}>
                        <Text style={styles.paramLabel}>Employment Type</Text>
                        <Text style={styles.paramValue}>{job.job_type || 'Full-Time'}</Text>
                    </View>

                    <View style={styles.paramCard}>
                        <Text style={styles.paramLabel}>Experience Required</Text>
                        <Text style={styles.paramValue}>{job.experience}+ Years</Text>
                    </View>

                    <View style={styles.paramCard}>
                        <Text style={styles.paramLabel}>Timeline Window</Text>
                        <Text style={styles.paramValue}>{formattedEndDate}</Text>
                    </View>
                </View>

                {/* 4. Full Job Specification */}
                <View style={styles.specContainer}>
                    <View style={styles.specHeader}>
                        <Text style={styles.specHeaderText}>Job Mandate, Requirements & Scope</Text>
                        <Text style={{ fontSize: 7, color: colors.slateMuted }}>
                            {formattedStartDate ? `Posted: ${formattedStartDate}` : `Created: ${formattedCreatedDate}`}
                        </Text>
                    </View>
                    <Text style={styles.specBody}>
                        {job.job_description || "No specific job description provided."}
                    </Text>
                </View>

                {/* 5. Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Confidential & Proprietary • EazyAI Autonomous Recruitment Systems
                    </Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
}
