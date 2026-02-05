import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle, Settings2 } from 'lucide-react';

export const Route = createFileRoute('/dashboard/discover')({
    component: RouteComponent,
})

function RouteComponent() {
    const experienceYears = Array.from({ length: 31 }, (_, i) => i.toString());
    const thresholds = Array.from({ length: 9 }, (_, i) => (40 + i * 5).toString());
    return (
        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border">
            {/* LEFT SIDE: Random Selection Dropdown */}
            <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Profile:</Label>
                <Select>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Profile" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="eng">Software Engineer</SelectItem>
                        <SelectItem value="pm">Product Manager</SelectItem>
                        <SelectItem value="da">Data Analyst</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* RIGHT SIDE: Modal Trigger */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Matching Profile
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Job Matching Criteria
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Job Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="jd">Job Description</Label>
                            <Textarea
                                id="jd"
                                placeholder="Paste the full job description here..."
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Preferred Domains */}
                        <div className="grid gap-2">
                            <Label htmlFor="domains">Preferred Domains</Label>
                            <Input id="domains" placeholder="e.g. Fintech, E-commerce, Healthcare" />
                        </div>

                        {/* Required Skills */}
                        <div className="grid gap-2">
                            <Label htmlFor="skills">Required Skills (comma separated)</Label>
                            <Input id="skills" placeholder="React, TypeScript, Node.js" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Experience Dropdown */}
                            <div className="grid gap-2">
                                <Label>Required Experience</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {experienceYears.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year} {year === "1" ? "Year" : "Years"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Threshold Dropdown */}
                            <div className="grid gap-2">
                                <Label>Matching Threshold</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select %" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {thresholds.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}% Match
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full">Search Profile</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
