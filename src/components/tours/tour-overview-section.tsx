
'use client';

interface TourOverviewSectionProps {
    dictionary: {
        title: string;
    };
    overview: string;
}

export function TourOverviewSection({ dictionary, overview }: TourOverviewSectionProps) {
    const paragraphs = overview.split('\n').filter(p => p.trim() !== '');
    
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6">{dictionary.title}</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
}
