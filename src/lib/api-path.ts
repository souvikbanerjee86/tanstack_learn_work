export const API_PATH = {
    BUCKET_LIST_API: {
        GET_BASE_URL: "https://bucket-list-api-820672860724.europe-west1.run.app",
        PATH_URL: "/api/list-objects?prefix=uploads"
    },
    RAG_SEARCH_API: {
        GET_BASE_URL: "https://rag-search-api-820672860724.europe-west1.run.app",
        PATH_URL: "/api/rag_search"
    },
    PROCESSED_FILES_ID: {
        GET_BASE_URL: "https://indexed-files-list-api-820672860724.europe-west1.run.app",
        PATH_URL: "/api/indexed-list-api"
    },
    TRIGGER_INDEX: {
        GET_BASE_URL: "https://trigger-index-api-820672860724.europe-west1.run.app",
        PATH_URL: "/api/trigger-indexing",
        CORPUS_ID: "137359788634800128"
    },
    JOB_DETAILS: {
        GET_BASE_URL: "https://jobs-list-api-820672860724.europe-west1.run.app",
        PATH_URL: "/api/jobs-list-api"
    }
}