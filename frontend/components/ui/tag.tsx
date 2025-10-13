
export const TagsList = ({ tags }: { tags: string[] }) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {tags.map((tag, index) => (
            <Tag key={index} tag={tag} />
        ))}
      </div>
    );
}

export const Tag = ({ tag }: { tag: string }) => {
    return (
      <span
        className="bg-option-background text-light-blue font-semibold border-2 border-light-blue px-3 py-1 rounded-full text-sm"
      >
        {tag}
      </span>
    );
}