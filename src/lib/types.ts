import type { LucideIcon } from 'lucide-react'

export interface NavPrimaryProps {
  items: Array<{
    title: string
    to: string
    icon: LucideIcon
    activeOptions?: {
      exact?: boolean
    }
  }>
}

export interface NavUserProps {
  email: string
  name?: string
  picture?: string
  user_id: string
}

export interface FileAsset {
  name: string
  full_path: string
  size: number
  content_type: string
  url: string
}

export interface Folder {
  name: string
  subfolders: Array<Folder> // Recursive definition if subfolders exist
  files: Array<FileAsset>
}

export interface BucketListResponse {
  root_folders: Array<Folder>
  root_files: Array<FileAsset>
  next_page_token: string | null
}

export interface CandidateMatch {
  candidate_name: string
  candidate_email: string
  years_of_experience: number
  primary_skills: Array<string>
  summary: string
  notice_period: string | null
  image: string | null
  source_ref: string
  matched_criteria: Array<string>
  missing_information: Array<string>
  seniority_level: 'Junior' | 'Mid' | 'Senior' | 'Lead' // Literal types for better safety
  matched_score: number
}

export interface ProfileSearchResponse {
  matches: Array<CandidateMatch>
}

export interface ProfileSearchCritieria {
  jobId: string
  jobDescription: string
  experience: number
  skills: string
  preferedDomain: string
}

export interface RagProcessRecord {
  id: string
  date: string
  rag_file_ids: Array<string>
  processed_at: string
}

export type JobDetail = {
  id: string
  job_title: string
  location: string
  job_id: string
  start_date: string
  end_date: string
  job_type: 'Full Time' | 'Part Time' | 'Contract' | 'Internship'
  job_description: string
  created_at: string
  status: 'Active' | 'Inactive' | 'Archived'
  experience: number
}

export type candidate = {
  id: string
  email: string
  job_name: string
  name: string
  resume_url: string
  uploaded_at: string
  job_id: string
  candidate_image?: string
}

export interface PaginatedJobResponse {
  count: number
  next_cursor: string | null
  data: Array<JobDetail>
}

export interface PaginatedCandidateResponse {
  count: number
  next_cursor: string | null
  data: Array<candidate>
}

export interface CandidateRecord {
  id: string
  processed_at: string
  email_sent: boolean
  candidate_email: string
  sent_at: string
  message_id: string
  job_id: string
  interview_status?: string
  verdict?: string
  feedback?: string
}

export interface CandidatePaginationResponse {
  count: number
  next_cursor: string | null
  data: Array<CandidateRecord>
}

export interface EvaluationData {
  id: string
  question: string
  answer: string
  candidate: string
  job_id: string
  createdAt: string | Date
  evaluated_at: string | Date
  answer_evaluation: boolean
  voice_evaluation: boolean
  text_evaluation: boolean
  session_id: string
  ai_verdict?: string
  domain?: string
  reasoning?: string
  score?: number
}

export interface EvaluationResponse {
  success: boolean
  count: number
  data: Array<EvaluationData>
}

export interface AnalysisResult {
  conclusion?: 'Human' | 'AI-generated' | string
  reasoning?: string
  confidence_score?: number
}

export interface InterviewRecord {
  gcs_uri: string
  bucket_name: string
  status: 'success' | 'failed' | string
  file_name: string
  job_id: string
  analysis_result?: AnalysisResult
  timestamp: string
  candidate: string
  session_id: string
  id: string
}

export interface InterviewVoiceOutcomeResponse {
  success: boolean
  count: number
  data: Array<InterviewRecord>
}

export interface JobPosting {
  id?: string
  jobId: string
  jobTitle: string
  jobDescription: string

  jobType: 'fulltime' | 'parttime' | 'contract' | 'internship'
  startDate: string
  endDate: string
  locations: Array<string>
  experience: number
  status: 'Active' | 'Inactive'
}

export interface UserRoleResponse {
  user_id: string
  role: string | null
}

export interface JobQuestion {
  id: string
  question: string
}

export interface JobQuestionsResponse {
  job_id: string
  questions: Array<JobQuestion>
  limit: number
  offset: number
  count: number
}

export interface GcsUriDetails {
  status: 'success' | 'error' | 'pending'
  gcs_uri: string
}

export interface GcsResponse {
  gcs_uri: GcsUriDetails
}

export interface DashboardSummaryResponse {
  active_jobs: number
  total_applicants: number
  hired: number
  growth_percentage: number
}

export interface EmailSyncRecord {
  id: string
  applicant_name: string
  email_body: string
  processed: boolean
  job_id: string
  created_at: string
  cv_filename: string
  applicant_email: string
}

export interface PaginatedEmailSyncResponse {
  count: number
  next_cursor: string | null
  data: Array<EmailSyncRecord>
}

export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

export interface UserEvent {
  time: string
  reason: string
}

export interface UserMovementData {
  user_id: string
  user_session: string
  job_id: string
  created_at: string // ISO 8601 Date string
  events: Array<UserEvent>
  user_email: string
  total_events: number
  id: string
}

export interface MovementOutcomeResponse {
  success: boolean
  count: number
  data: Array<UserMovementData>
}

/**
 * Represents the role-specific details for a user.
 */
export interface UserRole {
  active: boolean
  role: string
  user_id: string
}

/**
 * Represents an individual user record.
 */
export interface UserData {
  uid: string
  email: string
  display_name?: string | null
  photo_url?: string | null
  provider_id?: string | null
  created_at?: string
  last_sign_in?: string
  disabled: boolean
  user_role?: UserRole // Made optional as requested
}

/**
 * Represents the top-level API response.
 */
export interface AdminUserResponse {
  count: number
  data: Array<UserData>
}

export interface InterviewConfig {
  interviewTime: string
  linkValidity: string
  questionsCount: string
  lastModified?: string
}

export interface ConfigApiResponse {
  message: string
  data: InterviewConfig
}

export interface InterviewSessionInfo {
  session_id: string
  app: string
  user_id: string
}

export interface ADKResponse {
  id: string
  appName: string
  userId: string
  state: SessionState
  events: Array<ADKEvent>
  lastUpdateTime: number
}

export interface SessionState {
  total_prompt_tokens: number
  total_candidates_tokens: number
  total_tokens_consumed: number
  user_name?: string
  job_id?: string
  user_self_info?: string
  questions?: Array<string>
  current_question_index: number
  token_usage_saved_to_firestore?: boolean
}

export interface ADKEvent {
  id: string
  timestamp: number
  author: 'user' | 'virtual_interviewer' | string
  invocationId: string
  nodeInfo: NodeInfo
  customMetadata: CustomMetadata
  content: Content
  actions: Actions
  usageMetadata?: UsageMetadata // Optional because user inputs do not contain usage metrics
}

export interface NodeInfo {
  path: string
}

export interface CustomMetadata {
  candidate_email?: string
  [key: string]: any
}

export interface Content {
  parts: Array<Part>
  role: 'user' | 'model' | string
}

export interface Part {
  text?: string
  thoughtSignature?: string
  functionCall?: FunctionCall
  functionResponse?: FunctionResponse
}

export interface FunctionCall {
  id: string
  name:
    | 'save_name'
    | 'save_job_id'
    | 'tellme_about_yupurself'
    | 'submit_answer'
    | string
  args: {
    name?: string
    job_id?: string
    userselfinfo?: string
    answer?: string
    [key: string]: any
  }
}

export interface FunctionResponse {
  id: string
  name:
    | 'save_name'
    | 'save_job_id'
    | 'tellme_about_yupurself'
    | 'submit_answer'
    | string
  response: {
    result: string
    [key: string]: any
  }
}

export interface Actions {
  stateDelta: Partial<SessionState> & Record<string, any>
  artifactDelta: Record<string, any>
  requestedAuthConfigs: Record<string, any>
  requestedToolConfirmations: Record<string, any>
}

export interface UsageMetadata {
  candidatesTokenCount: number
  candidatesTokensDetails: Array<TokenDetail>
  promptTokenCount: number
  promptTokensDetails: Array<TokenDetail>
  thoughtsTokenCount?: number
  totalTokenCount: number
  trafficType: 'ON_DEMAND' | string
  cacheTokensDetails?: Array<TokenDetail>
  cachedContentTokenCount?: number
}

export interface TokenDetail {
  modality: 'TEXT' | 'AUDIO' | string
  tokenCount: number
}

export interface FailedFileDetail {
  filename: string
  reason: string
}

export interface MultipleCvUploadResponse {
  job_id: string
  uploaded_files: Array<string>
  failed_files: Array<FailedFileDetail>
}

export interface AudioAnalysisRecord {
  id: string
  conclusion: 'AI-generated' | 'Human' | 'Suspicious' | string
  confidence_score: number
  reasoning: string
  candidate: string
  job_id: string
  session_id?: string
  gcs_uri?: string
  file_name?: string
  status: string
  timestamp?: string
}

export interface AggregatedVoiceAnalysisResponse {
  candidate: string
  job_id: string
  total_audios_analyzed: number
  overall_conclusion: 'AI-generated' | 'Suspicious' | 'Human' | string
  average_confidence: number
  ai_generated_count: number
  human_count: number
  records: Array<AudioAnalysisRecord>
}

export type AudioAnalysisResponse = AggregatedVoiceAnalysisResponse

export interface AudioAnalysisInputSchema {
  candidateEmail: string
  jobId: string
}

export interface InterviewVideoRecord {
  file_name: string
  full_path: string
  bucket_name: string
  session_id?: string
  size_bytes: number
  size_formatted: string
  content_type: string
  created_at?: string
  updated_at?: string
  video_url: string
  stream_url?: string
  metadata?: Record<string, any>
}

export interface InterviewVideoResponse {
  success: boolean
  count: number
  message?: string
  data: Array<InterviewVideoRecord>
}

