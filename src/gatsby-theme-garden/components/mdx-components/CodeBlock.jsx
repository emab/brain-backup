import React, { useMemo } from 'react';
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

    const convertedMatch = useMemo(() => convertLanguage(match && match[1]), [match])
    return match
      ? <SyntaxHighlighter language={convertedMatch} PreTag="div" {...props} style={a11yDark}/>
      : <SyntaxHighlighter className={className} {...props} style={a11yDark}/>
  }