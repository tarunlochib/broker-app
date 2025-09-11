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
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <span className="text-2xl">📁</span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-2">No documents uploaded yet</div>
          <div className="text-sm text-gray-500">Upload documents to complete your application</div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
            </div>
          </div>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="group/doc p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-white hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200 border border-transparent hover:border-indigo-200/50 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(doc.category || "other")}</span>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {doc.category || "other"}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate group-hover/doc:text-indigo-700 transition-colors duration-200">
                      {doc.fileName}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatFileSize(doc.size)} • {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doc.status)}`}>
                      {doc.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
