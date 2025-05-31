import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiUser, FiSettings, FiCalendar, FiDollarSign, FiUsers, FiBarChart2, FiCode, FiGlobe } from 'react-icons/fi';

const iconMap = {
  'user-plus': <FiUser className="w-6 h-6 text-blue-500" />,
  'building': <FiSettings className="w-6 h-6 text-green-500" />,
  'tachometer-alt': <FiBarChart2 className="w-6 h-6 text-purple-500" />,
  'calendar': <FiCalendar className="w-6 h-6 text-yellow-500" />,
  'dollar-sign': <FiDollarSign className="w-6 h-6 text-green-500" />,
  'users': <FiUsers className="w-6 h-6 text-indigo-500" />,
  'code': <FiCode className="w-6 h-6 text-gray-500" />,
  'globe': <FiGlobe className="w-6 h-6 text-blue-400" />,
};

export const Card = ({ title, icon, link, children, className = '' }) => {
  const content = (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center mb-4">
        {icon && (
          <div className="mr-3 p-2 bg-blue-50 rounded-full">
            {iconMap[icon] || iconMap['code']}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 flex-grow">
        {children}
      </div>
      {link && (
        <div className="mt-4">
          <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Learn more <FiArrowRight className="ml-1" />
          </span>
        </div>
      )}
    </div>
  );

  return link ? (
    <Link href={link} className="block h-full hover:no-underline">
      {content}
    </Link>
  ) : content;
};

export const CardGrid = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
