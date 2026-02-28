import TagsClient from "./TagsClient";

export const metadata = {
  title: "Kilala Admin - Tags",
};

export default function AdminTagsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Thẻ (Tags)</h2>
      </div>
      <TagsClient />
    </div>
  );
}
