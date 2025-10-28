import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const CommentsSection = ({ songId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const maxLength = 500;

  const token = localStorage.getItem('authToken');
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/songs/${songId}/comments/`);
        setComments(res.data);
      } catch (err) {
        console.error('❌ Error fetching comments:', err);
      }
    };

    if (!userLoading && songId) fetchComments();
  }, [songId, userLoading]);

  const handleSubmit = async () => {
    if (!comment.trim() || !token || userLoading || !user) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/songs/${songId}/comments/add/`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setComment('');
    } catch (err) {
      console.error('❌ Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!token || userLoading || !user) return;
    try {
      await axios.delete(`http://localhost:8000/api/comments/${commentId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('❌ Error deleting comment:', err);
    }
  };

  const handleEdit = async (commentId) => {
    if (!token || userLoading || !user) return;
    try {
      const res = await axios.put(
        `http://localhost:8000/api/comments/${commentId}/edit/`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: res.data.content } : c))
      );
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      console.error('❌ Error editing comment:', err);
    }
  };

  if (userLoading) return null; // ⛔ Avoid rendering until user is loaded

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

      {/* Comment Box */}
      <textarea
        placeholder="Please share your thought..."
        className="w-full p-4 rounded-lg bg-neutral-800 text-white resize-none"
        rows={4}
        maxLength={maxLength}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="text-right text-sm text-gray-400 mt-1">
        {comment.length}/{maxLength}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2 disabled:opacity-50"
        disabled={!comment.trim() || loading}
      >
        {loading ? 'Posting...' : 'Comment'}
      </button>

      {/* Comment List */}
      <div className="mt-6 space-y-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-neutral-800 rounded-lg p-4 text-sm border border-neutral-700"
          >
            <div className="flex justify-between items-center text-gray-400 mb-1">
              <div className="flex items-center gap-2">
                <img
                  src={c.profile_picture}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>{c.display_name}</span>
              </div>
              <span className="text-xs">{new Date(c.timestamp).toLocaleString()}</span>
            </div>

            {editingCommentId === c.id ? (
              <>
                <textarea
                  className="w-full mt-2 bg-neutral-700 text-white rounded p-2 text-sm"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex justify-end mt-1 gap-2">
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="text-gray-300 hover:text-gray-100 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(c.id)}
                    className="text-blue-500 hover:text-blue-400 text-xs"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <p className="text-white">{c.content}</p>
            )}

            {/* Edit/Delete buttons */}
            {user?.id === c.user_id && editingCommentId !== c.id && (
              <div className="text-right mt-2 space-x-2 text-xs text-gray-400">
                <button onClick={() => {
                  setEditingCommentId(c.id);
                  setEditContent(c.content);
                }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(c.id)}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
