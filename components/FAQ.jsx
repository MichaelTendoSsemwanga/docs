'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiExternalLink, FiSearch } from 'react-icons/fi';

const FAQItem = ({ item, isOpen, onClick, index }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-sm">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-${index}`}
      >
        <span className="font-medium text-gray-900 text-left">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
          <FiChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <motion.div
        id={`faq-${index}`}
        ref={contentRef}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0.8,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 pt-2 text-gray-600 bg-white">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ 
            __html: item.answer.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
              (match, text, url) => 
                `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${text} <FiExternalLink class="inline w-3 h-3" /></a>`
            ) 
          }} />
          
          {item.links && (
            <div className="mt-4 space-y-2">
              {item.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="block text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                  <FiExternalLink className="ml-1 w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

function FAQ({ 
  items = [], 
  searchable = false, 
  category = 'all',
  maxItems = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(category);

  // Filter items by search term and category
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .slice(0, maxItems || items.length);

  // Extract unique categories
  const categories = ['all', ...new Set(items.map(item => item.category).filter(Boolean))];

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {(searchable || categories.length > 1) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          {searchable && (
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search FAQs..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    activeCategory === cat
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FAQItem
                  item={item}
                  isOpen={openIndex === index}
                  onClick={() => toggleItem(index)}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No FAQs found. Try adjusting your search or filter criteria.
        </div>
      )}
    </div>
  );
}

export default FAQ;
