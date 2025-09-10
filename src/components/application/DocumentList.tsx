import { Card } from "@/components/ui/Card";

interface DocumentListProps {
  documents: any[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      identity: "🆔",
      income: "💰",
      bank: "🏦",
      property: "🏠",
      loan: "📋",
      other: "📄"
    };
    return icons[category] || "📄";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_scan: "bg-yellow-100 text-yellow-800 border-yellow-200",
      safe: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="group p-6 bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">Documents</h3>
            <p className="text-sm text-gray-600">Uploaded files and documents</p>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full">
            <span className="text-sm font-bold text-purple-700">{documents.length} files</span>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-2">No documents uploaded yet</div>
            <div className="text-sm text-gray-500">Upload documents to complete your application</div>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="group/doc flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 group-hover/doc:scale-110 transition-transform duration-300">
                  <span className="text-xl">{getCategoryIcon(doc.category || "other")}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 truncate group-hover/doc:text-purple-700 transition-colors duration-200">
                    {doc.fileName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{doc.category || "other"}</span> • 
                    <span className="mx-1">{formatFileSize(doc.size)}</span> • 
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getStatusColor(doc.status)} group-hover/doc:scale-105 transition-transform duration-200`}>
                    {doc.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
