import ComponentCard from "@/components/common/ComponentCard";

interface MigratedFeaturePageProps {
  title: string;
  route: string;
}

const wordsFromRoute = (route: string): string[] => {
  return route
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/[\[\]-]/g, " "));
};

export default function MigratedFeaturePage({ title, route }: MigratedFeaturePageProps) {
  const keywords = wordsFromRoute(route);

  return (
    <div className="space-y-6">
      <ComponentCard
        title={title}
        desc="Template-native migration shell. Feature logic is being integrated without replacing this template UI."
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Route: <code className="font-mono text-xs">{route}</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((word) => (
              <span
                key={word}
                className="inline-flex rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
