'use client';

import { useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';

const theme = {
  paragraph: 'mb-2',
  heading: {
    h1: 'text-2xl font-bold mb-3',
    h2: 'text-xl font-bold mb-2',
    h3: 'text-lg font-bold mb-2',
  },
  list: {
    ul: 'list-disc ml-4 mb-2',
    ol: 'list-decimal ml-4 mb-2',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  link: 'text-indigo-500 hover:underline',
  quote: 'border-l-4 border-slate-300 pl-4 italic text-slate-600',
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderline(selection.hasFormat('underline'));
        }
      });
    });
  }, [editor]);

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const formatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  const insertBulletList = () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  const insertNumberedList = () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  const btnClass = (active: boolean) =>
    `p-2 rounded transition-colors ${
      active
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 flex-wrap">
      <button type="button" onClick={undo} className={btnClass(false)} title="Undo">
        <Undo size={18} />
      </button>
      <button type="button" onClick={redo} className={btnClass(false)} title="Redo">
        <Redo size={18} />
      </button>
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
      <button type="button" onClick={formatBold} className={btnClass(isBold)} title="Bold">
        <Bold size={18} />
      </button>
      <button type="button" onClick={formatItalic} className={btnClass(isItalic)} title="Italic">
        <Italic size={18} />
      </button>
      <button type="button" onClick={formatUnderline} className={btnClass(isUnderline)} title="Underline">
        <Underline size={18} />
      </button>
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
      <button type="button" onClick={insertBulletList} className={btnClass(false)} title="Bullet List">
        <List size={18} />
      </button>
      <button type="button" onClick={insertNumberedList} className={btnClass(false)} title="Numbered List">
        <ListOrdered size={18} />
      </button>
    </div>
  );
}

function InitialContentPlugin({ initialHtml }: { initialHtml: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || !initialHtml) return;
    isInitializedRef.current = true;
    
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      if (nodes.length === 0) {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(''));
        root.append(paragraph);
      } else {
        root.append(...nodes);
      }
    });
  }, [editor, initialHtml]);

  return null;
}

interface LexicalEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function LexicalEditor({ value, onChange, placeholder = 'Nhập nội dung...' }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'EventEditor',
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    onError: (error: Error) => console.error(error),
  };

  const handleChange = (editorState: EditorState, editor: ReturnType<typeof useLexicalComposerContext>[0]) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      onChange(html);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
        <ToolbarPlugin />
        <div className="relative min-h-[200px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[200px] p-4 outline-none text-sm text-slate-900 dark:text-slate-200" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-slate-400 pointer-events-none text-sm">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
        <InitialContentPlugin initialHtml={value} />
      </div>
    </LexicalComposer>
  );
}
