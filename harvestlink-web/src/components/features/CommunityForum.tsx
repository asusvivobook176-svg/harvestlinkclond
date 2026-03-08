import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, Reply, Send, User } from 'lucide-react';

interface Post {
    id: number;
    author: string;
    content: string;
    category: string;
    timestamp: Date;
    likes: number;
    replies: number;
}

const categories = ['General', 'Crop Tips', 'Market Prices', 'Weather', 'Equipment'];

const initialPosts: Post[] = [
    {
        id: 1,
        author: 'Ram Kumar',
        content: 'Anyone else noticing late blight on tomatoes this season? Looking for organic prevention tips.',
        category: 'Crop Tips',
        timestamp: new Date(Date.now() - 3600000 * 2),
        likes: 12,
        replies: 5
    },
    {
        id: 2,
        author: 'Sita Devi',
        content: 'High demand for organic beans in the Coimbatore market right now. Prices are up by 20%.',
        category: 'Market Prices',
        timestamp: new Date(Date.now() - 3600000 * 5),
        likes: 24,
        replies: 8
    }
];

export const CommunityForum: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [newPost, setNewPost] = useState('');
    const [category, setCategory] = useState('General');

    const handlePostSubmit = () => {
        if (newPost.trim()) {
            const post: Post = {
                id: Date.now(),
                author: 'You',
                content: newPost,
                category,
                timestamp: new Date(),
                likes: 0,
                replies: 0
            };
            setPosts([post, ...posts]);
            setNewPost('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-emerald-600" /> Farmer Community Forum
                </h2>
                <p className="text-gray-500 text-sm mb-8">Connect with fellow farmers, share experiences, and learn together.</p>

                {/* New Post Form */}
                <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Share an insight or ask a question to the community..."
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-hidden transition-all text-sm font-medium min-h-[100px]"
                    />

                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category:</span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handlePostSubmit}
                            disabled={!newPost.trim()}
                            className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <Send size={14} /> Post to Forum
                        </button>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                    <AnimatePresence initial={false}>
                        {posts.map(post => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-emerald-100 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">
                                            {post.author === 'You' ? <User size={20} /> : post.author[0]}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm">{post.author}</p>
                                            <p className="text-[10px] font-medium text-gray-400">
                                                {post.timestamp.toLocaleDateString()} · {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">{post.content}</p>

                                <div className="flex gap-6 items-center">
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-emerald-600 transition-colors">
                                        <ThumbsUp size={14} /> {post.likes} Helpful
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-emerald-600 transition-colors">
                                        <Reply size={14} /> {post.replies} Replies
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
