"use client";

type ContentType = "blog" | "link";

interface ContentTypeSelectorProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
}

export function ContentTypeSelector({ value, onChange }: ContentTypeSelectorProps) {
  return (
    <div className="w-full">
      <div className="mb-2 block text-sm font-medium text-muted-foreground">Select Content Type</div>
      <div className="flex items-center gap-6 border-b">
        <button
          type="button"
          onClick={() => onChange("blog")}
          className={`pb-2 -mb-px text-sm font-medium transition-colors ${
            value === "blog"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📝 Blog Post
        </button>
        <button
          type="button"
          onClick={() => onChange("link")}
          className={`pb-2 -mb-px text-sm font-medium transition-colors ${
            value === "link"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          🔗 External Link
        </button>
      </div>
    </div>
  );
}

