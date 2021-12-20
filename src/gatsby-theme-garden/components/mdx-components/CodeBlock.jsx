import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const convertLanguage = (language) => {
    switch (language) {
        case 'js':
            return 'javascript';
        case 'ts':
            return 'typescript';
        default:
            return language;
    }
}

export default ({className, ...props}) => { 
    const match = /language-(\w+)/.exec(className || '')

    return match
      ? <SyntaxHighlighter language={convertLanguage(match && match[1])} PreTag="div" {...props} style={a11yDark}/>
      : <SyntaxHighlighter className={className} {...props} style={a11yDark}/>
  }