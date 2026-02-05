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