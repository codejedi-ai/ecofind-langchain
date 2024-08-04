/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
*/
import React from "react";
import ReactDOM from "react-dom/client";
import Chatbox from "./Chatbox.jsx";
import { formatConvHistory } from "./utils/formatConvHistory.js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { combineDocuments } from "./utils/combineDocuments.js";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";
import { fetchSecrets } from "./utils/getsecrets.js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// save the secrets in a varaible
let openAIApiKey;
let supabaseUrl;
let supabaseApiKey;
let progressConversation;
fetchSecrets().then((fetched_ret) => {
  const secret = JSON.parse(fetched_ret.body);
  console.log(secret);

  // You can now use the parsed secret object
  openAIApiKey = secret.REACT_APP_OPENAI_API_KEY;
  supabaseUrl = secret.REACT_APP_SUPABASE_URL_LC_CHATBOT;
  supabaseApiKey = secret.REACT_APP_SUPABASE_API_KEY;

  console.log(openAIApiKey);
  console.log(supabaseUrl);
  console.log(supabaseApiKey);

  // Continue with the rest of your initialization code
  // ...

  const client = createClient(supabaseUrl, supabaseApiKey);
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  const retriever = vectorStore.asRetriever();
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    progressConversation();
  });

  const llm = new ChatOpenAI({ openAIApiKey });

  const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`;
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about ecofind based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@ecofind.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
conversation history: {conv_history}
question: {question}
answer: `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser());

  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standalone_question,
    retriever,
    combineDocuments,
  ]);
  const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

  const chain = RunnableSequence.from([
    {
      standalone_question: standaloneQuestionChain,
      original_input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_input }) => original_input.question,
      conv_history: ({ original_input }) => original_input.conv_history,
    },
    answerChain,
  ]);

  const convHistory = [];

  progressConversation = async function () {
    const userInput = document.getElementById("user-input");
    const chatbotConversation = document.getElementById(
      "chatbot-conversation-container"
    );
    const question = userInput.value;
    userInput.value = "";

    // add human message
    const newHumanSpeechBubble = document.createElement("div");
    newHumanSpeechBubble.classList.add("speech", "speech-human");
    chatbotConversation.appendChild(newHumanSpeechBubble);
    newHumanSpeechBubble.textContent = question;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    const response = await chain.invoke({
      question: question,
      conv_history: formatConvHistory(convHistory),
    });
    convHistory.push(question);
    convHistory.push(response);
    // add AI message
    const newAiSpeechBubble = document.createElement("div");
    newAiSpeechBubble.classList.add("speech", "speech-ai");
    chatbotConversation.appendChild(newAiSpeechBubble);
    newAiSpeechBubble.textContent = response;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
  }

  // ReactDOM.render(<AwsCerts certs={certs} />, document.getElementById('AWSCerts'));
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement);

  root.render(<Chatbox />);

  // ReactDOM.render(<Resume />, document.getElementById("Resume"))
  // AWSCerts
});
