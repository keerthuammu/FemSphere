import React from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminArticles() {
  const {
    articles,
    setShowAddArticleModal,
    handleDeleteArticle
  } = useAdmin();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="font-bold text-2xl text-[#3a3135]">Manage Health Content</h3>
          <p className="text-sm text-[#64595e]">Publish evidence-based health articles for FemSphere users</p>
        </div>
        <button 
          onClick={() => setShowAddArticleModal(true)} 
          className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map(art => (
          <div key={art.id} className="p-5 rounded-3xl border border-[#EDE9FE] bg-[#FAF8FC] space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] uppercase">
                {art.category}
              </span>
              <h4 className="text-lg font-bold text-[#3a3135]">{art.title}</h4>
              <p className="text-sm text-[#64595e] leading-relaxed">{art.desc}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE]">
              <span className="text-xs font-bold text-[#7a6f75]">#{art.id}</span>
              <button 
                onClick={() => handleDeleteArticle(art.id)} 
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Article
              </button>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="col-span-2 p-12 text-center text-[#7a6f75] italic bg-[#FAF8FC] rounded-3xl border border-[#EDE9FE]">
            No health articles published yet. Click "Add Article" above to publish an evidence-based guide.
          </div>
        )}
      </div>
    </div>
  );
}
