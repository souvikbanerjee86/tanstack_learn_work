import { LucideIcon } from "lucide-react"

export interface NavPrimaryProps {
    items: {
        title: string
        to: string
        icon: LucideIcon,
        activeOptions?: {
            exact?: boolean
        }
    }[]
}

export interface NavUserProps {
    email: string
    name?: string
    picture?: string
    user_id: string
}

export interface FileAsset {
    name: string;
    full_path: string;
    size: number;
    content_type: string;
    url: string;
}

export interface Folder {
    name: string;
    subfolders: Folder[]; // Recursive definition if subfolders exist
    files: FileAsset[];
}

export interface BucketListResponse {
    root_folders: Folder[];
    root_files: FileAsset[];
    next_page_token: string | null;
}


export interface CandidateMatch {
    candidate_name: string;
    candidate_email: string;
    years_of_experience: number;
    primary_skills: string[];
    summary: string;
    notice_period: string | null;
    image: string | null;
    source_ref: string;
    matched_criteria: string[];
    missing_information: string[];
    seniority_level: "Junior" | "Mid" | "Senior" | "Lead"; // Literal types for better safety
    matched_score: number;
}

export interface ProfileSearchResponse {
    matches: CandidateMatch[];
}

export interface ProfileSearchCritieria {
    jobId: string;
    jobDescription: string;
    experience: number;
    skills: string;
    preferedDomain: string;
}

export interface RagProcessRecord {
    id: string;
    date: string;
    rag_file_ids: string[];
    processed_at: string;
}

export type JobDetail = {
    id: string;
    job_title: string;
    location: string;
    job_id: string;
    start_date: string;
    end_date: string;
    job_type: "Full Time" | "Part Time" | "Contract" | "Internship";
    job_description: string;
    created_at: string;
    status: "Active" | "Inactive" | "Archived";
    experience: number;
}

export type candidate = {
    id: string;
    email: string;
    job_name: string;
    name: string;
    resume_url: string;
    uploaded_at: string;
    job_id: string;
    candidate_image?: string
}


export interface PaginatedJobResponse {
    count: number;
    next_cursor: string | null;
    data: JobDetail[];
}

export interface PaginatedCandidateResponse {
    count: number;
    next_cursor: string | null;
    data: candidate[];
}


export interface CandidateRecord {
    id: string;
    processed_at: string;
    email_sent: boolean;
    candidate_email: string;
    sent_at: string;
    message_id: string;
    job_id: string;
    interview_status?: string;
    verdict?: string;
}

export interface CandidatePaginationResponse {
    count: number;
    next_cursor: string | null;
    data: CandidateRecord[];
}

export interface EvaluationData {
    id: string;
    question: string;
    answer: string;
    candidate: string;
    job_id: string;
    createdAt: string | Date;
    evaluated_at: string | Date;
    answer_evaluation: boolean;
    voice_evaluation: boolean;
    text_evaluation: boolean;

    ai_verdict?: string;
    domain?: string;
    reasoning?: string;
    score?: number;
}

export interface EvaluationResponse {
    success: boolean;
    count: number;
    data: EvaluationData[];
}

export interface AnalysisResult {
    conclusion?: "Human" | "AI-generated" | string;
    reasoning?: string;
    confidence_score?: number;
}

export interface InterviewRecord {
    gcs_uri: string;
    bucket_name: string;
    status: "success" | "failed" | string;
    file_name: string;
    job_id: string;
    analysis_result?: AnalysisResult;
    timestamp: string;
    candidate: string;
    session_id: string;
    id: string;
}

export interface InterviewVoiceOutcomeResponse {
    success: boolean;
    count: number;
    data: InterviewRecord[];
}

export interface JobPosting {
    id?: string;
    jobId: string;
    jobTitle: string;
    jobDescription: string;

    jobType: 'fulltime' | 'parttime' | 'contract' | 'internship';
    startDate: string;
    endDate: string;
    locations: string[];
    experience: number;
}

export interface UserRoleResponse {
    user_id: string;
    role: string | null;
}

export interface JobQuestion {
    id: string;
    question: string;
}

export interface JobQuestionsResponse {
    job_id: string;
    questions: JobQuestion[];
    limit: number;
    offset: number;
    count: number;
}

export interface GcsUriDetails {
    status: "success" | "error" | "pending";
    gcs_uri: string;
}

export interface GcsResponse {
    gcs_uri: GcsUriDetails;
}

export interface DashboardSummaryResponse {
    active_jobs: number;
    total_applicants: number;
    hired: number;
    growth_percentage: number;
}

export interface EmailSyncRecord {
    id: string;
    applicant_name: string;
    email_body: string;
    processed: boolean;
    job_id: string;
    created_at: string;
    cv_filename: string;
    applicant_email: string;
}

export interface PaginatedEmailSyncResponse {
    count: number;
    next_cursor: string | null;
    data: EmailSyncRecord[];
}

export const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];



export interface UserEvent {
    time: string;
    reason: string;
}

export interface UserMovementData {
    user_id: string;
    user_session: string;
    job_id: string;
    created_at: string; // ISO 8601 Date string
    events: UserEvent[];
    user_email: string;
    total_events: number;
    id: string;
}

export interface MovementOutcomeResponse {
    success: boolean;
    count: number;
    data: UserMovementData[];
}


/**
 * Represents the role-specific details for a user.
 */
export interface UserRole {
    active: boolean;
    role: string;
    user_id: string;
}

/**
 * Represents an individual user record.
 */
export interface UserData {
    uid: string;
    email: string;
    display_name: string;
    photo_url: string;
    provider_id: string;
    created_at: string;
    last_sign_in: string;
    disabled: boolean;
    user_role?: UserRole; // Made optional as requested
}

/**
 * Represents the top-level API response.
 */
export interface AdminUserResponse {
    count: number;
    data: UserData[];
}