
import { Avatar, Box, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../../context/AuthContext";

function extractCodeFromString(message: string) {
  const regex = /```([a-z]*)\n([\s\S]*?)```/g;
  let match;
  const blocks = [];
  let lastIndex = 0;

  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: message.slice(lastIndex, match.index),
      });
    }

    blocks.push({ type: "code", content: match[2], language: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < message.length) {
    blocks.push({ type: "text", content: message.slice(lastIndex) });
  }

  return blocks;
}

function isCodeBlock(block: any) {
  return block.type === "code";
}

const ChatItem = ({ content, role }: { content: string; role: string }) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d5612",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
      <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box>
        {messageBlocks.map((block: any, index) =>
          isCodeBlock(block) ? (
            <>
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language={block.language || "javascript"}
              >
                {(block.language || "javascript") + "\n" + "\n" + block.content}
              </SyntaxHighlighter>
            </>
          ) : (
            <Typography key={index} sx={{ fontSize: "20px" }}>
              {block.content}
            </Typography>
          )
        )}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d56",
        gap: 2,
        borderRadius: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name[0]}
        {auth?.user?.name.split(" ")[1]?.[0]}
      </Avatar>
      <Box>
        {messageBlocks.map((block: any, index) =>
          isCodeBlock(block) ? (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                {block.language.toUpperCase() || "JAVASCRIPT"}
              </Typography>
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language={block.language || "javascript"}
              >
                {block.content}
              </SyntaxHighlighter>
            </>
          ) : (
            <Typography key={index} sx={{ fontSize: "20px" }}>
              {block.content}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
