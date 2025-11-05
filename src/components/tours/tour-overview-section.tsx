
'use client';

interface TourOverviewSectionProps {
    dictionary: {
        title: string;
        content: string[];
    };
}

export function TourOverviewSection({ dictionary }: TourOverviewSectionProps) {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6">{dictionary.title}</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
                {dictionary.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
