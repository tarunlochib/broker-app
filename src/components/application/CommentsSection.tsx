"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface CommentsSectionProps {
  applicationId: string;
}

export function CommentsSection({ applicationId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [applicationId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications/${applicationId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/applications/${applicationId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment("");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="col-span-2 space-y-4">
      {/* Existing Comments */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Recent Comments ({comments.length})
        </div>
        
        {isLoading ? (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500 italic">Loading comments...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500 italic">No comments yet. Be the first to add a note!</div>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.user.name?.charAt(0) || comment.user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {comment.user.name || comment.user.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Comment Form */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Add New Comment</div>
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea 
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 hover:border-gray-300" 
            rows={4}
            placeholder="Add a comment or note about this application..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Comments are visible to brokers and administrators
            </div>
            <button 
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
