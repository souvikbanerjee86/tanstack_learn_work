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