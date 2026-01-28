'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { RootState } from '../../../store/store';
import { Quiz, Course, Lesson, Assignment } from '../../../../types';
import { HelpCircle, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import api from '../../../../lib/axios';
import toast from 'react-hot-toast';

export default function CourseQuizzes() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const { user } = useSelector((state: RootState) => state.auth);

    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | null>(null);

    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const [quizStates, setQuizStates] = useState<Record<string, { answers: (number | number[])[], submitted: boolean, score: number }>>({});

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;
            try {
                const [courseRes, quizRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get(`/quizzes/course/${courseId}`)
                ]);
                setCourse(courseRes.data);
                const fetchedQuizzes = quizRes.data;
                setQuizzes(fetchedQuizzes);

                // Initialize states for each quiz
                const initialStates: Record<string, { answers: (number | number[])[], submitted: boolean, score: number }> = {};
                fetchedQuizzes.forEach((q: Quiz) => {
                    initialStates[q._id] = {
                        answers: q.questions.map(question => question.type === 'multiple' ? [] : -1),
                        submitted: false,
                        score: 0
                    };
                });
                setQuizStates(initialStates);

                if (fetchedQuizzes.length > 0) {
                    setSelectedQuizId(fetchedQuizzes[0]._id);
                }
            } catch (err) {
                console.error('Error fetching quiz data:', err);
                toast.error('Failed to load quizzes');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleQuizSubmit = async (quizId: string) => {
        const currentState = quizStates[quizId];
        if (!currentState) return;

        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, {
                answers: currentState.answers
            });

            setQuizStates(prev => ({
                ...prev,
                [quizId]: {
                    ...prev[quizId],
                    submitted: true,
                    score: response.data.score
                }
            }));
            toast.success('Quiz submitted successfully!');
        } catch (err: any) {
            console.error('Error submitting quiz:', err);
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to submit quiz');
        }
    };

    const updateAnswers = (quizId: string, qIndex: number, oIndex: number) => {
        setQuizStates(prev => {
            const quiz = quizzes.find(q => q._id === quizId);
            const question = quiz?.questions[qIndex];
            const currentAnswers = [...prev[quizId].answers];

            if (question?.type === 'multiple') {
                const currentArr = Array.isArray(currentAnswers[qIndex]) ? (currentAnswers[qIndex] as number[]) : [];
                if (currentArr.includes(oIndex)) {
                    currentAnswers[qIndex] = currentArr.filter(i => i !== oIndex);
                } else {
                    currentAnswers[qIndex] = [...currentArr, oIndex];
                }
            } else {
                currentAnswers[qIndex] = oIndex;
            }

            return {
                ...prev,
                [quizId]: {
                    ...prev[quizId],
                    answers: currentAnswers
                }
            };
        });
    };

    const resetQuiz = (quizId: string) => {
        setQuizStates(prev => {
            const quiz = quizzes.find(q => q._id === quizId);
            return {
                ...prev,
                [quizId]: {
                    answers: quiz ? quiz.questions.map(question => question.type === 'multiple' ? [] : -1) : [],
                    submitted: false,
                    score: 0
                }
            };
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const selectedQuiz = quizzes.find(q => q._id === selectedQuizId);
    const selectedState = selectedQuizId ? quizStates[selectedQuizId] : null;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/lesson/${courseId}`)}
                    className="mb-6 flex items-center gap-2 hover:bg-primary/10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Lessons
                </Button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">{course?.title} - Assessments</h1>
                    </div>
                    <p className="text-muted-foreground">Select an assessment and answer all questions to test your knowledge.</p>
                </div>

                {quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Quiz List */}
                        <div className="lg:col-span-1 space-y-3">
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Quiz List</h2>
                            {quizzes.map((quiz, idx) => {
                                const state = quizStates[quiz._id];
                                const isActive = selectedQuizId === quiz._id;
                                return (
                                    <button
                                        key={quiz._id}
                                        onClick={() => setSelectedQuizId(quiz._id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${isActive
                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                            : 'border-transparent hover:bg-muted bg-card hover:border-muted-foreground/10 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                                                    }`}>
                                                    <HelpCircle className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                                        {idx + 1}. {quiz.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {quiz.questions.length} Questions
                                                    </p>
                                                </div>
                                            </div>
                                            {state?.submitted && (
                                                <div className="bg-green-100 text-green-600 p-1 rounded-full">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area - Active Quiz */}
                        <div className="lg:col-span-3">
                            {selectedQuiz && selectedState ? (
                                <Card className="overflow-hidden border-none shadow-premium bg-card">
                                    <CardHeader className="bg-primary/5 border-b border-primary/10 py-8 px-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 text-primary mb-2">
                                                    <span className="px-3 py-1 bg-primary/20 text-[10px] font-black uppercase tracking-widest rounded-full">Assessment</span>
                                                </div>
                                                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                                                    {selectedQuiz.title}
                                                </CardTitle>
                                                <CardDescription className="mt-2 text-base">
                                                    Ready to test your knowledge? This quiz contains {selectedQuiz.questions.length} questions.
                                                </CardDescription>
                                            </div>
                                            {selectedState.submitted && (
                                                <div className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-black text-center shadow-lg shadow-primary/20">
                                                    <p className="text-[10px] uppercase opacity-70 mb-1">Final Score</p>
                                                    <p className="text-3xl">{selectedState.score} <span className="text-sm opacity-50">/ {selectedQuiz.questions.length}</span></p>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        {!selectedState.submitted ? (
                                            <div className="space-y-10">
                                                {selectedQuiz.questions.map((question, qIndex) => (
                                                    <div key={qIndex} className="p-8 rounded-2xl bg-muted/30 border border-muted-foreground/10 transition-all hover:bg-muted/40">
                                                        <div className="flex justify-between items-start mb-6">
                                                            <h3 className="text-xl font-bold flex gap-4 pr-10">
                                                                <span className="text-primary opacity-50 shrink-0">0{qIndex + 1}</span>
                                                                {question.question}
                                                            </h3>
                                                            {question.type === 'multiple' && (
                                                                <span className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-2 py-1 rounded">Multiple Choice</span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {question.options.map((option, oIndex) => {
                                                                const isSelected = question.type === 'multiple'
                                                                    ? (selectedState.answers[qIndex] as number[]).includes(oIndex)
                                                                    : selectedState.answers[qIndex] === oIndex;
                                                                return (
                                                                    <button
                                                                        key={oIndex}
                                                                        onClick={() => updateAnswers(selectedQuiz._id, qIndex, oIndex)}
                                                                        className={`flex items-center p-5 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden ${isSelected
                                                                            ? 'border-primary bg-primary/10 text-primary shadow-md'
                                                                            : 'border-transparent bg-background hover:border-primary/30 hover:bg-primary/5'
                                                                            }`}
                                                                    >
                                                                        {isSelected && (
                                                                            <div className="absolute top-0 right-0 p-2">
                                                                                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                                                    <CheckCircle className="h-3 w-3 text-white" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        <span className={`flex items-center justify-center h-8 w-8 rounded-lg text-sm font-black mr-4 transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                                                                            }`}>
                                                                            {String.fromCharCode(65 + oIndex)}
                                                                        </span>
                                                                        <span className="font-semibold">{option}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="pt-6">
                                                    <Button
                                                        onClick={() => handleQuizSubmit(selectedQuiz._id)}
                                                        disabled={selectedState.answers.some(ans => Array.isArray(ans) ? ans.length === 0 : ans === -1)}
                                                        className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                                    >
                                                        Submit Assessment
                                                    </Button>
                                                    <p className="text-center text-xs text-muted-foreground mt-4 italic">
                                                        Please answer all questions before submitting.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 max-w-2xl mx-auto">
                                                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 mb-8 shadow-inner">
                                                    <CheckCircle className="h-12 w-12" />
                                                </div>
                                                <h3 className="text-4xl font-black mb-4">Quiz Completed!</h3>
                                                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                                                    Great job completing the assessment. You achieved a score of <span className="text-primary font-black underline decoration-primary/30 underline-offset-8">{selectedState.score} out of {selectedQuiz.questions.length}</span>.
                                                </p>

                                                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 mb-10 text-left relative overflow-hidden">
                                                    <HelpCircle className="absolute -right-4 -bottom-4 h-32 w-32 text-primary/5" />
                                                    <p className="text-lg font-bold text-primary mb-2">Performance Review</p>
                                                    <p className="text-muted-foreground font-medium relative z-10">
                                                        {selectedState.score === selectedQuiz.questions.length
                                                            ? "Outstanding effort! You've successfully mastered all recording concepts in this section."
                                                            : selectedState.score >= selectedQuiz.questions.length / 2
                                                                ? "Strong work! You clearly understand the core principles, though there's still room for minor refinement."
                                                                : "Don't be discouraged. Learning is an iterative process. We recommend reviewing the lesson material and giving it another shot."}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                                    <Button
                                                        variant="outline"
                                                        className="h-14 px-10 rounded-xl font-bold border-2"
                                                        onClick={() => resetQuiz(selectedQuiz._id)}
                                                    >
                                                        Retake Assessment
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-none shadow-premium py-32 bg-card/50">
                                    <CardContent className="text-center">
                                        <HelpCircle className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-10" />
                                        <h3 className="text-2xl font-black text-muted-foreground">Select an Assessment</h3>
                                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Click on a quiz from the left sidebar to start your knowledge check.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                ) : (
                    <Card className="border-none shadow-premium py-32">
                        <CardContent className="text-center">
                            <HelpCircle className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-10" />
                            <h3 className="text-2xl font-black text-muted-foreground">No Quizzes Available</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">There are currently no assessments published for this course. Please check back later.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <style jsx>{`
                .shadow-premium {
                    box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
}

