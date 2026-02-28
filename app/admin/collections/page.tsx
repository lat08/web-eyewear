import CollectionsClient from "./CollectionsClient";

export const metadata = {
  title: "Kilala Admin - Collections",
};

export default function AdminCollectionsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bộ Sưu Tập (Collections)</h2>
      </div>
      <CollectionsClient />
    </div>
  );
}
