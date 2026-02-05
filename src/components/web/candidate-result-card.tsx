import { Briefcase, CheckCircle2, AlertCircle, FileText, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Use the interface from our previous step
import { CandidateMatch } from "@/lib/types";

export function CandidateResultCard({ data }: { data: CandidateMatch }) {
    return (
        <Card className="w-full border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">{data.candidate_name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <Briefcase className="h-3 w-3" />
                                {data.seniority_level} • {data.years_of_experience} Years Exp.
                            </CardDescription>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge variant={data.matched_score > 70 ? "default" : "secondary"} className="text-lg px-3 py-1">
                            {data.matched_score}% Match
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Source: {data.source_ref}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Summary Section */}
                <div className="text-sm text-muted-foreground leading-relaxed italic">
                    "{data.summary}"
                </div>

                {/* Skills Section */}
                <div className="flex flex-wrap gap-2">
                    {data.primary_skills && data.primary_skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-primary/5">
                            {skill}
                        </Badge>
                    ))}
                </div>

                <Separator />

                {/* Comparison Logic: Matched vs Missing */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" /> Matched Criteria
                        </h4>
                        <ul className="text-xs space-y-1">
                            {data.matched_criteria && data.matched_criteria.map((item, i) => (
                                <li key={i} className="flex gap-2 text-muted-foreground">
                                    <span>•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {data.missing_information && data.missing_information.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold flex items-center gap-1 text-amber-600">
                                <AlertCircle className="h-3 w-3" /> Missing Info
                            </h4>
                            <ul className="text-xs space-y-1">
                                {data.missing_information.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-muted-foreground">
                                        <span>•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="bg-muted/30 pt-4 flex justify-between">
                <div className="text-xs text-muted-foreground">
                    Notice: {data.notice_period || "Not mentioned"}
                </div>
                <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                    <FileText className="h-3 w-3" /> View Source Document
                </button>
            </CardFooter>
        </Card>
    );
}