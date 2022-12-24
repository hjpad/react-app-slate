// import React from "react";
// import "./style.css";

import React, { useState, useCallback, useMemo } from 'react';

import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Editor, Transforms, Text } from 'slate';

// const initialValue = [
//   {
//     type: 'paragraph',
//     children: [{ text: 'A line of text in a paragraph.' }],
//   },
// ];

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))
  // Update the initial content to be pulled from Local Storage if it exists.
  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content')) || [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  )

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
    >
      <Editable />
    </Slate>
  )
}

export default App;
