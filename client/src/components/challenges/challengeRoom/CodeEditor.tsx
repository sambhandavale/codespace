import { useState, useRef, useEffect } from 'react';
import {basicSetup, EditorView} from "codemirror"
import { python } from '@codemirror/lang-python'; // Import Python language support
// import { oneDark } from '@codemirror/theme-one-dark'; // Import desired theme

const CodeEditor = () => {
  const [code, setCode] = useState("print('Hello, World!')\n");
  const [output, setOutput] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    const view = new EditorView({
      doc: code,
      extensions: [basicSetup, python()],
      parent: editorRef.current,
      dispatch: (tr) => {
        view.update([tr]);
        setCode(view.state.doc.toString());
      },
    });

    return () => {
      view.destroy();
    };
  }, []);

  const runCode = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Use the current state
      });

      const data = await response.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output);
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code.');
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div className="editor">
      <section className="top">
        <div className="title">{`< CODE />`}</div>
      </section>
      <section className="code">
        <div ref={editorRef} style={{ height: '400px', width: '100%' }} />
      </section>
      <section className="middle">
        <div className="run" onClick={runCode}>RUN</div>
        <div className="submit">SUBMIT</div>
        <div className="run" onClick={clearOutput}>CLEAR</div>
      </section>
      <section className="output">
        <div className='outputtext'>{output}</div>
      </section>
    </div>
  );
};

export default CodeEditor;
