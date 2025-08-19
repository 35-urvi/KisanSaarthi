import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import {
  Search,
  Filter,
  Plus,
  MessageCircle,
  Clock,
  User,
  Tag,
  ArrowLeft,
  Send,
  X,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Eye
} from 'lucide-react';

const CommunityForum = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '', tags: '' });
  const [newAnswer, setNewAnswer] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const questionsPerPage = 6;
  const tags = ['crop-disease', 'irrigation', 'fertilizer', 'pest-control', 'seeds', 'weather', 'market-price', 'organic-farming'];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Sample data
  const sampleQuestions = [
    {
      id: 1,
      title: "मेरे टमाटर के पौधों में पत्तियां पीली हो रही हैं, क्या करूं?",
      description: "मैंने 2 महीने पहले टमाटर के पौधे लगाए थे। अब उनकी पत्तियां धीरे-धीरे पीली होकर गिरने लगी हैं। मिट्टी में नमी है और पानी भी नियमित दे रहा हूं। कृपया सलाह दें कि यह किस कारण से हो रहा है और इसका समाधान क्या है।",
      author: "राम प्रसाद शर्मा",
      date: "2025-08-10",
      tags: ['crop-disease', 'fertilizer'],
      views: 45,
      answers: [
        {
          id: 1,
          author: "डॉ. सुनील कुमार",
          content: "यह नाइट्रोजन की कमी का संकेत हो सकता है। यूरिया का छिड़काव करें और मिट्टी की जांच कराएं। साथ ही जल निकासी की व्यवस्था भी देखें।",
          date: "2025-08-11",
          likes: 8,
          dislikes: 0
        },
        {
          id: 2,
          author: "किसान मित्र",
          content: "पत्तियों की जांच करें कि कहीं कीड़े तो नहीं हैं। अगर कीड़े हैं तो नीम का तेल स्प्रे करें।",
          date: "2025-08-12",
          likes: 5,
          dislikes: 1
        }
      ]
    },
    {
      id: 2,
      title: "धान की फसल के लिए सबसे अच्छा समय कब है?",
      description: "मैं गुजरात में हूं और इस साल धान की खेती करना चाहता हूं। कृपया बताएं कि यहां धान बोने का सबसे उपयुक्त समय क्या है और किस किस्म का चुनाव करना चाहिए।",
      author: "अमित पटेल",
      date: "2025-08-09",
      tags: ['seeds', 'weather'],
      views: 32,
      answers: [
        {
          id: 3,
          author: "कृषि विशेषज्ञ",
          content: "गुजरात में धान बोने का सबसे अच्छा समय जून के दूसरे सप्ताह से जुलाई का पहला सप्ताह है। GR-11 और GR-4 किस्में यहां अच्छी होती हैं।",
          date: "2025-08-10",
          likes: 12,
          dislikes: 0
        }
      ]
    },
    {
      id: 3,
      title: "जैविक खाद बनाने की विधि क्या है?",
      description: "मैं रासायनिक उर्वरकों का कम उपयोग करना चाहता हूं। घर पर जैविक खाद कैसे बनाई जाती है? कौन से सामग्री की जरूरत होती है?",
      author: "सुरेश भाई",
      date: "2025-08-08",
      tags: ['organic-farming', 'fertilizer'],
      views: 67,
      answers: [
        {
          id: 4,
          author: "जैविक कृषि सलाहकार",
          content: "कंपोस्ट बनाने के लिए गोबर, सूखे पत्ते, रसोई का कचरा और मिट्टी मिलाकर 3-4 महीने रखें। नियमित पलटते रहें।",
          date: "2025-08-09",
          likes: 15,
          dislikes: 1
        },
        {
          id: 5,
          author: "प्राकृतिक खेती प्रेमी",
          content: "केंचुआ खाद भी बहुत अच्छी होती है। इसके लिए केंचुए और जैविक पदार्थ चाहिए।",
          date: "2025-08-10",
          likes: 10,
          dislikes: 0
        }
      ]
    },
    {
      id: 4,
      title: "सिंचाई के लिए ड्रिप सिस्टम कैसे लगाएं?",
      description: "मेरे पास 5 एकड़ जमीन है और मैं पानी की बचत के लिए ड्रिप इरिगेशन लगाना चाहता हूं। इसकी लागत और फायदे के बारे में बताएं।",
      author: "विकास गुप्ता",
      date: "2025-08-07",
      tags: ['irrigation'],
      views: 89,
      answers: []
    },
    {
      id: 5,
      title: "मूंगफली की फसल में कीड़े का प्रकोप, क्या करें?",
      description: "मूंगफली के पौधों की पत्तियों में छेद हो रहे हैं और कुछ कीड़े दिख रहे हैं। इसका इलाज क्या है?",
      author: "जयेश भाई पटेल",
      date: "2025-08-06",
      tags: ['pest-control', 'crop-disease'],
      views: 56,
      answers: [
        {
          id: 6,
          author: "कीट नियंत्रण विशेषज्ञ",
          content: "यह संभवतः पत्ती खाने वाले कैटरपिलर हैं। BT स्प्रे या नीम आधारित कीटनाशक का उपयोग करें।",
          date: "2025-08-07",
          likes: 7,
          dislikes: 0
        }
      ]
    }
  ];

  useEffect(() => {
    setQuestions(sampleQuestions);
    setFilteredQuestions(sampleQuestions);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(q => q.tags.includes(selectedFilter));
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, questions]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage);

  const handleSubmitQuestion = () => {
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) return;

    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      description: newQuestion.description,
      author: "राम प्रसाद",
      date: new Date().toISOString().split('T')[0],
      tags: newQuestion.tags ? newQuestion.tags.split(',').map(tag => tag.trim()) : [],
      views: 0,
      answers: []
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: '', description: '', tags: '' });
    setShowAskModal(false);
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim() || !selectedQuestion) return;

    const answer = {
      id: Date.now(),
      author: "राम प्रसाद",
      content: newAnswer,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0
    };

    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id 
        ? { ...q, answers: [...q.answers, answer] }
        : q
    );

    setQuestions(updatedQuestions);
    setSelectedQuestion({ ...selectedQuestion, answers: [...selectedQuestion.answers, answer] });
    setNewAnswer('');
  };

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Community Forum" />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <button
                onClick={() => setSelectedQuestion(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Questions
              </button>
            </motion.div>

            {/* Question Detail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-stone-200 mb-6"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-800 mb-4">{selectedQuestion.title}</h1>
                <p className="text-stone-600 leading-relaxed mb-4">{selectedQuestion.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{selectedQuestion.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedQuestion.date).toLocaleDateString('hi-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedQuestion.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{selectedQuestion.answers.length} answers</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedQuestion.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Answers */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Answers ({selectedQuestion.answers.length})
              </h2>
              
              {selectedQuestion.answers.map((answer) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
                >
                  <p className="text-stone-700 mb-4 leading-relaxed">{answer.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-stone-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{answer.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(answer.date).toLocaleDateString('hi-IN')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-2 py-1 rounded text-sm text-emerald-600 hover:bg-emerald-50">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{answer.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded text-sm text-stone-500 hover:bg-stone-50">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{answer.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Answer Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
            >
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Your Answer</h3>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="अपना उत्तर यहाँ लिखें..."
                className="w-full p-4 border border-stone-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows="6"
              />
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  Submit Answer
                </motion.button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="Community Forum" />

      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <MessageCircle className="w-8 h-8" />
                  Community Forum 🌾
                </h1>
                <p className="text-emerald-100 text-lg">Connect with fellow farmers and share knowledge</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAskModal(true)}
                className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Ask a Question
              </motion.button>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl p-6 shadow-lg border border-stone-200"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-3 border border-stone-300 rounded-lg hover:bg-stone-50 min-w-[200px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-stone-500" />
                    <span>{selectedFilter === 'all' ? 'All Categories' : selectedFilter}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-300 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setSelectedFilter('all');
                        setShowFilterDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      All Categories
                    </button>
                    {tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedFilter(tag);
                          setShowFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Questions List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentQuestions.map((question) => (
              <motion.div
                key={question.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedQuestion(question)}
                className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 hover:shadow-lg cursor-pointer transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-stone-800 mb-3 line-clamp-2">
                  {question.title}
                </h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-3">
                  {question.description.substring(0, 100)}...
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                  {question.tags.length > 2 && (
                    <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-full text-xs">
                      +{question.tags.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-stone-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{question.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{question.answers.length}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(question.date).toLocaleDateString('hi-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center gap-2"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-stone-300 rounded-lg disabled:opacity-50 hover:bg-emerald-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page 
                      ? 'bg-emerald-600 text-white' 
                      : 'border border-stone-300 hover:bg-emerald-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-stone-300 rounded-lg disabled:opacity-50 hover:bg-emerald-50"
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Ask a Question</h2>
              <button
                onClick={() => setShowAskModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full"
              >
                <X className="w-6 h-6 text-stone-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  placeholder="अपना प्रश्न संक्षेप में लिखें"
                  className="w-full p-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                  placeholder="अपने प्रश्न का विस्तृत विवरण दें..."
                  className="w-full p-4 border border-stone-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows="6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                  placeholder="crop-disease, irrigation, fertilizer (comma separated)"
                  className="w-full p-4 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Suggested tags: {tags.join(', ')}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowAskModal(false)}
                  className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitQuestion}
                  disabled={!newQuestion.title.trim() || !newQuestion.description.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Submit Question
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;