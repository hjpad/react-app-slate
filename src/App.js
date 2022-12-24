// import React from "react";
// import "./style.css";

import React, { useState, useCallback } from 'react';

import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Editor, Transforms, Text } from 'slate';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        renderElement={renderElement}
        // Pass in the `renderLeaf` function.
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case '`': {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === 'code',
              });
              Transforms.setNodes(
                editor,
                { type: match ? null : 'code' },
                { match: (n) => Editor.isBlock(editor, n) }
              );
              break;
            }

            case 'b': {
              event.preventDefault();
              Transforms.setNodes(
                editor,
                { bold: true },
                { match: (n) => Text.isText(n), split: true }
              );
              break;
            }

            case ' ': {
              console.log('a');
              event.preventDefault();
              Transforms.setNodes(
                editor,
                { bold: false },
                { match: (n) => Text.isText(n), split: true }
              );
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  );
};

export default App;
