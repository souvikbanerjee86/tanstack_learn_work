
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CandidateResultCard } from '@/components/web/candidate-result-card';
import { EmptyState } from '@/components/web/empty-state';
import { MultiStepLoader } from '@/components/web/multi-step-loader';
import { SearchProfileForm } from '@/components/web/search-profile-form';
import { getSearchProfileDetails } from '@/lib/server-function';
import { ProfileSearchCritieria, ProfileSearchResponse, RagProcessRecord } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/dashboard/discover')({
    component: RouteComponent,
    // loader: async () => {
    //     const data: RagProcessRecord[] = await getProcessedIndex()
    //     return data
    // }
})

function RouteComponent() {
    // const data: RagProcessRecord[] = Route.useLoaderData()
    const [results, setResults] = useState<ProfileSearchResponse | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const onProfileSearchSubmit = async (formData: ProfileSearchCritieria) => {
        try {
            setIsSubmitting(true)
            const jobDescription = formData.jobDescription;
            const preferedDomain = formData.preferedDomain;
            const skills = formData.skills;
            const experience = formData.experience;
            const results: ProfileSearchResponse = await getSearchProfileDetails({ data: { jobDescription, preferedDomain, skills, experience } })
            setResults(results)
            setIsSubmitting(false)
        } catch (e) {
            console.log(e)
            setIsSubmitting(false)
        }

    }
    const hasResults = results && results.matches && results.matches.length > 0;

    return (
        <>

            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border">
                {/* LEFT SIDE: Random Selection Dropdown */}
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Select CV store Date:</Label>
                    <Select>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select CV store Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select CV store Date</SelectLabel>
                                {/* {data.map((item, idx) => (
                                    <SelectItem key={idx} value={item.id}>
                                        {item.date}
                                    </SelectItem>
                                ))} */}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* RIGHT SIDE: Modal Trigger */}
                <SearchProfileForm onProfileSearchSubmit={onProfileSearchSubmit} />
            </div>
            {isSubmitting && <MultiStepLoader isLoading={isSubmitting} />}
            <div className="container py-8 mx-auto">
                {!hasResults ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold">Matching Candidates</h2>
                            <span className="text-sm font-medium text-muted-foreground">
                                {results.matches.length} profiles found
                            </span>
                        </div>
                        {results.matches.map((candidate, idx) => (
                            <CandidateResultCard key={idx} data={candidate} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
