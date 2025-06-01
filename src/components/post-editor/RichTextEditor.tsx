
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignRight, AlignCenter } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandValue('justifyLeft') || document.queryCommandState('justifyLeft')) formats.add('left');
    if (document.queryCommandState('justifyCenter')) formats.add('center');
    if (document.queryCommandState('justifyRight')) formats.add('right');
    
    setActiveFormats(formats);
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateActiveFormats();
    }
  }, [onChange, updateActiveFormats]);

  const handleKeyUp = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handleMouseUp = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-gray-600 rounded-t-md bg-gray-800">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
              activeFormats.has('bold') && "bg-gray-700 text-white"
            )}
            onClick={() => executeCommand('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
              activeFormats.has('italic') && "bg-gray-700 text-white"
            )}
            onClick={() => executeCommand('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
              activeFormats.has('underline') && "bg-gray-700 text-white"
            )}
            onClick={() => executeCommand('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
              activeFormats.has('left') && "bg-gray-700 text-white"
            )}
            onClick={() => executeCommand('justifyLeft')}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
              activeFormats.has('center') && "bg-gray-700 text-white"
            )}
            onClick={() => executeCommand('justifyCenter')}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700",
              activeFormats.has('right') && "bg-gray-700 text-white"
            )}
            onClick={() => executeCommand('justifyRight')}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        dangerouslySetInnerHTML={{ __html: value }}
        className={cn(
          "min-h-[120px] p-3 bg-gray-800 border border-gray-600 border-t-0 rounded-b-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent",
          className
        )}
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
        data-placeholder={placeholder}
      />
      
      <style>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: rgb(156 163 175);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
